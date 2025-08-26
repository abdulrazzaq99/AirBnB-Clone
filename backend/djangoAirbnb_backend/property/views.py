from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property, Reservation, Review, Wishlist, PropertyImage
from .serializers import (
    PropertyListSerializer,
    PropertyDetailSerializer,
    PropertyCreateUpdateSerializer,
    ReservationSerializer,
    ReviewSerializer,
    WishlistSerializer,
    PropertySearchSerializer,
)


class PropertyListCreateView(generics.ListCreateAPIView):
    """List all properties or create a new property"""

    queryset = Property.objects.filter(is_available=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["title", "location", "description"]
    ordering_fields = ["price_per_night", "average_rating", "created_at"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PropertyCreateUpdateSerializer
        return PropertyListSerializer

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)

    def get_queryset(self):
        queryset = Property.objects.filter(is_available=True)

        # Search parameters
        destination = self.request.query_params.get("destination")
        check_in = self.request.query_params.get("check_in")
        check_out = self.request.query_params.get("check_out")
        guests = self.request.query_params.get("guests")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        property_type = self.request.query_params.get("property_type")

        if destination:
            queryset = queryset.filter(
                Q(location__icontains=destination)
                | Q(title__icontains=destination)
                | Q(description__icontains=destination)
            )

        if guests:
            try:
                guests_int = int(guests)
                queryset = queryset.filter(guests__gte=guests_int)
            except ValueError:
                pass

        if min_price:
            try:
                min_price_decimal = float(min_price)
                queryset = queryset.filter(price_per_night__gte=min_price_decimal)
            except ValueError:
                pass

        if max_price:
            try:
                max_price_decimal = float(max_price)
                queryset = queryset.filter(price_per_night__lte=max_price_decimal)
            except ValueError:
                pass

        if property_type and property_type != "all":
            queryset = queryset.filter(property_type=property_type)

        # Filter out properties that are booked for the given dates
        if check_in and check_out:
            booked_properties = Reservation.objects.filter(
                status__in=["confirmed", "pending"],
                check_in__lt=check_out,
                check_out__gt=check_in,
            ).values_list("property_id", flat=True)
            queryset = queryset.exclude(id__in=booked_properties)

        return queryset


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a property"""

    queryset = Property.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return PropertyCreateUpdateSerializer
        return PropertyDetailSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_update(self, serializer):
        # Only allow property owner to update
        if self.get_object().host != self.request.user:
            raise permissions.PermissionDenied("You can only edit your own properties.")
        serializer.save()

    def perform_destroy(self, instance):
        # Only allow property owner to delete
        if instance.host != self.request.user:
            raise permissions.PermissionDenied(
                "You can only delete your own properties."
            )
        instance.delete()


class UserPropertiesView(generics.ListAPIView):
    """List properties owned by the authenticated user"""

    serializer_class = PropertyListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(host=self.request.user)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_reservation(request):
    """Create a new reservation"""
    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(guest=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReservationListView(generics.ListAPIView):
    """List user's reservations"""

    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(guest=self.request.user)


class ReservationDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve or update a reservation"""

    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(guest=self.request.user)

    def perform_update(self, serializer):
        # Only allow status updates for now
        instance = self.get_object()
        if "status" in serializer.validated_data:
            if (
                instance.status == "confirmed"
                and serializer.validated_data["status"] == "cancelled"
            ):
                serializer.save()
            else:
                raise permissions.PermissionDenied(
                    "You can only cancel confirmed reservations."
                )
        else:
            raise permissions.PermissionDenied("Only status updates are allowed.")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_reservation(request, reservation_id):
    """Cancel a reservation"""
    try:
        reservation = Reservation.objects.get(
            id=reservation_id, guest=request.user, status="confirmed"
        )
        reservation.status = "cancelled"
        reservation.save()
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data)
    except Reservation.DoesNotExist:
        return Response(
            {"error": "Reservation not found or cannot be cancelled"},
            status=status.HTTP_404_NOT_FOUND,
        )


class PropertyReviewsView(generics.ListCreateAPIView):
    """List reviews for a property or create a new review"""

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        property_id = self.kwargs["property_id"]
        return Review.objects.filter(property_id=property_id)

    def perform_create(self, serializer):
        property_id = self.kwargs["property_id"]
        property_obj = get_object_or_404(Property, id=property_id)

        # Check if user has a completed reservation for this property
        reservation = Reservation.objects.filter(
            property=property_obj, guest=self.request.user, status="completed"
        ).first()

        if not reservation:
            raise permissions.PermissionDenied(
                "You can only review properties you have stayed at."
            )

        # Check if user already reviewed this reservation
        if hasattr(reservation, "review"):
            raise permissions.PermissionDenied("You have already reviewed this stay.")

        serializer.save(
            guest=self.request.user, property=property_obj, reservation=reservation
        )


class WishlistView(generics.ListCreateAPIView):
    """List user's wishlist or add property to wishlist"""

    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        property_id = self.request.data.get("property_id")
        property_obj = get_object_or_404(Property, id=property_id)

        # Check if already in wishlist
        if Wishlist.objects.filter(
            user=self.request.user, property=property_obj
        ).exists():
            raise permissions.PermissionDenied("Property already in wishlist.")

        serializer.save(user=self.request.user, property=property_obj)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, property_id):
    """Remove property from wishlist"""
    try:
        wishlist_item = Wishlist.objects.get(user=request.user, property_id=property_id)
        wishlist_item.delete()
        return Response(
            {"message": "Removed from wishlist"}, status=status.HTTP_204_NO_CONTENT
        )
    except Wishlist.DoesNotExist:
        return Response(
            {"error": "Property not in wishlist"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["GET"])
def property_search(request):
    """Advanced property search"""
    serializer = PropertySearchSerializer(data=request.query_params)
    if serializer.is_valid():
        queryset = Property.objects.filter(is_available=True)

        # Apply filters based on search parameters
        validated_data = serializer.validated_data

        if validated_data.get("destination"):
            destination = validated_data["destination"]
            queryset = queryset.filter(
                Q(location__icontains=destination) | Q(title__icontains=destination)
            )

        if validated_data.get("guests"):
            queryset = queryset.filter(guests__gte=validated_data["guests"])

        if validated_data.get("min_price"):
            queryset = queryset.filter(price_per_night__gte=validated_data["min_price"])

        if validated_data.get("max_price"):
            queryset = queryset.filter(price_per_night__lte=validated_data["max_price"])

        if validated_data.get("property_type"):
            queryset = queryset.filter(property_type=validated_data["property_type"])

        if validated_data.get("amenities"):
            for amenity in validated_data["amenities"]:
                queryset = queryset.filter(amenities__icontains=amenity)

        # Filter by availability dates
        if validated_data.get("check_in") and validated_data.get("check_out"):
            check_in = validated_data["check_in"]
            check_out = validated_data["check_out"]

            booked_properties = Reservation.objects.filter(
                status__in=["confirmed", "pending"],
                check_in__lt=check_out,
                check_out__gt=check_in,
            ).values_list("property_id", flat=True)

            queryset = queryset.exclude(id__in=booked_properties)

        properties = PropertyListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(properties.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
