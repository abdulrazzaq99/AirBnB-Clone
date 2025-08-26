from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import (
    CustomUserDetailsSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
)

User = get_user_model()


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""

    serializer_class = CustomUserDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""

    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # Allow anyone to register


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    serializer = ChangePasswordSerializer(
        data=request.data, context={"request": request}
    )
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"message": "Password changed successfully"})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def become_host(request):
    """Toggle user host status"""
    user = request.user
    user.is_host = not user.is_host
    user.save()

    status_message = "You are now a host!" if user.is_host else "Host status removed."
    return Response({"message": status_message, "is_host": user.is_host})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """Get user statistics"""
    user = request.user

    from property.models import Property, Reservation, Review

    stats = {
        "total_properties": Property.objects.filter(host=user).count(),
        "total_reservations": Reservation.objects.filter(guest=user).count(),
        "total_reviews_given": Review.objects.filter(guest=user).count(),
        "total_reviews_received": Review.objects.filter(property__host=user).count(),
    }

    if user.is_host:
        # Additional host stats
        host_properties = Property.objects.filter(host=user)
        total_bookings = Reservation.objects.filter(
            property__in=host_properties
        ).count()
        completed_bookings = Reservation.objects.filter(
            property__in=host_properties, status="completed"
        ).count()

        stats.update(
            {
                "host_total_bookings": total_bookings,
                "host_completed_bookings": completed_bookings,
            }
        )

    return Response(stats)
