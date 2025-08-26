from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class Property(models.Model):
    PROPERTY_TYPES = [
        ("apartment", "Apartment"),
        ("house", "House"),
        ("villa", "Villa"),
        ("cabin", "Cabin"),
        ("loft", "Loft"),
        ("townhouse", "Townhouse"),
        ("cottage", "Cottage"),
        ("other", "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    address = models.TextField()
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )

    property_type = models.CharField(
        max_length=20, choices=PROPERTY_TYPES, default="apartment"
    )
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)

    # Capacity
    guests = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    bedrooms = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    bathrooms = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1)]
    )

    # Features
    amenities = models.TextField(help_text="Comma-separated list of amenities")

    # Availability
    is_available = models.BooleanField(default=True)
    minimum_nights = models.PositiveIntegerField(default=1)
    maximum_nights = models.PositiveIntegerField(default=365)

    # Relationships
    host = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="properties"
    )

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Rating (calculated field)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    review_count = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Properties"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def get_amenities_list(self):
        """Return amenities as a list"""
        return [
            amenity.strip() for amenity in self.amenities.split(",") if amenity.strip()
        ]

    def set_amenities_list(self, amenities_list):
        """Set amenities from a list"""
        self.amenities = ", ".join(amenities_list)


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="property_images/")
    caption = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Image for {self.property.title}"


class Reservation(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="reservations"
    )
    guest = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reservations"
    )

    check_in = models.DateField()
    check_out = models.DateField()
    guests_count = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    nights = models.PositiveIntegerField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    # Payment info (simplified)
    payment_status = models.CharField(max_length=20, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Reservation for {self.property.title} by {self.guest.email}"

    def save(self, *args, **kwargs):
        # Calculate nights
        self.nights = (self.check_out - self.check_in).days
        super().save(*args, **kwargs)


class Review(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="reviews"
    )
    guest = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews"
    )
    reservation = models.OneToOneField(
        Reservation, on_delete=models.CASCADE, related_name="review"
    )

    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("property", "guest", "reservation")
        ordering = ["-created_at"]

    def __str__(self):
        return f"Review for {self.property.title} by {self.guest.email}"


class Wishlist(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlists"
    )
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="wishlisted_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "property")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.property.title}"
