from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Property, PropertyImage, Reservation, Review, Wishlist

User = get_user_model()


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image", "caption", "is_primary", "order"]


class HostSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "avatar", "bio", "is_host"]


class PropertyListSerializer(serializers.ModelSerializer):
    """Serializer for property list view (basic info)"""

    images = PropertyImageSerializer(many=True, read_only=True)
    host = HostSerializer(read_only=True)
    amenities_list = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "location",
            "price_per_night",
            "guests",
            "bedrooms",
            "bathrooms",
            "property_type",
            "average_rating",
            "review_count",
            "images",
            "host",
            "amenities_list",
            "is_available",
        ]

    def get_amenities_list(self, obj):
        return obj.get_amenities_list()


class PropertyDetailSerializer(serializers.ModelSerializer):
    """Serializer for property detail view (full info)"""

    images = PropertyImageSerializer(many=True, read_only=True)
    host = HostSerializer(read_only=True)
    amenities_list = serializers.SerializerMethodField()
    is_wishlisted = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "description",
            "location",
            "address",
            "property_type",
            "price_per_night",
            "guests",
            "bedrooms",
            "bathrooms",
            "amenities_list",
            "minimum_nights",
            "maximum_nights",
            "is_available",
            "average_rating",
            "review_count",
            "images",
            "host",
            "created_at",
            "is_wishlisted",
        ]

    def get_amenities_list(self, obj):
        return obj.get_amenities_list()

    def get_is_wishlisted(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return Wishlist.objects.filter(user=user, property=obj).exists()
        return False


class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating properties"""

    amenities_list = serializers.ListField(
        child=serializers.CharField(max_length=100), write_only=True, required=False
    )
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            "title",
            "description",
            "location",
            "address",
            "latitude",
            "longitude",
            "property_type",
            "price_per_night",
            "guests",
            "bedrooms",
            "bathrooms",
            "amenities_list",
            "minimum_nights",
            "maximum_nights",
            "is_available",
            "images",
        ]

    def create(self, validated_data):
        amenities_list = validated_data.pop("amenities_list", [])
        property_instance = Property.objects.create(**validated_data)
        if amenities_list:
            property_instance.set_amenities_list(amenities_list)
            property_instance.save()
        return property_instance

    def update(self, instance, validated_data):
        amenities_list = validated_data.pop("amenities_list", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if amenities_list is not None:
            instance.set_amenities_list(amenities_list)
        instance.save()
        return instance


class ReservationSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    guest = HostSerializer(read_only=True)
    property_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Reservation
        fields = [
            "id",
            "property",
            "property_id",
            "guest",
            "check_in",
            "check_out",
            "guests_count",
            "total_price",
            "nights",
            "status",
            "payment_status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["nights", "total_price"]

    def validate(self, data):
        check_in = data.get("check_in")
        check_out = data.get("check_out")

        if check_in and check_out:
            if check_in >= check_out:
                raise serializers.ValidationError(
                    "Check-out date must be after check-in date."
                )

            # Calculate nights and total price
            nights = (check_out - check_in).days
            if nights < 1:
                raise serializers.ValidationError("Minimum stay is 1 night.")

            # Get property to validate capacity and calculate price
            property_id = data.get("property_id")
            if property_id:
                try:
                    property_obj = Property.objects.get(id=property_id)
                    if data.get("guests_count", 0) > property_obj.guests:
                        raise serializers.ValidationError(
                            f"Maximum {property_obj.guests} guests allowed."
                        )

                    if nights < property_obj.minimum_nights:
                        raise serializers.ValidationError(
                            f"Minimum stay is {property_obj.minimum_nights} nights."
                        )

                    if nights > property_obj.maximum_nights:
                        raise serializers.ValidationError(
                            f"Maximum stay is {property_obj.maximum_nights} nights."
                        )

                    # Calculate total price
                    data["total_price"] = property_obj.price_per_night * nights
                    data["nights"] = nights

                except Property.DoesNotExist:
                    raise serializers.ValidationError("Property not found.")

        return data

    def create(self, validated_data):
        property_id = validated_data.pop("property_id")
        property_obj = Property.objects.get(id=property_id)
        validated_data["property"] = property_obj
        return super().create(validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    guest = HostSerializer(read_only=True)
    property = PropertyListSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "property", "guest", "rating", "comment", "created_at"]
        read_only_fields = ["property", "guest"]


class WishlistSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "property", "created_at"]


class PropertySearchSerializer(serializers.Serializer):
    """Serializer for property search parameters"""

    destination = serializers.CharField(required=False, allow_blank=True)
    check_in = serializers.DateField(required=False)
    check_out = serializers.DateField(required=False)
    guests = serializers.IntegerField(required=False, min_value=1)
    min_price = serializers.DecimalField(
        required=False, max_digits=10, decimal_places=2, min_value=0
    )
    max_price = serializers.DecimalField(
        required=False, max_digits=10, decimal_places=2, min_value=0
    )
    property_type = serializers.CharField(required=False, allow_blank=True)
    amenities = serializers.ListField(
        child=serializers.CharField(), required=False, allow_empty=True
    )
