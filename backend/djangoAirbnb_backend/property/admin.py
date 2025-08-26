from django.contrib import admin
from .models import Property, PropertyImage, Reservation, Review, Wishlist


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ["image", "caption", "is_primary", "order"]


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "host",
        "location",
        "price_per_night",
        "guests",
        "is_available",
        "average_rating",
        "created_at",
    ]
    list_filter = ["property_type", "is_available", "created_at", "price_per_night"]
    search_fields = ["title", "location", "host__email", "host__name"]
    readonly_fields = [
        "id",
        "created_at",
        "updated_at",
        "average_rating",
        "review_count",
    ]
    inlines = [PropertyImageInline]

    fieldsets = (
        ("Basic Info", {"fields": ("title", "description", "host", "property_type")}),
        ("Location", {"fields": ("location", "address", "latitude", "longitude")}),
        (
            "Details",
            {
                "fields": (
                    "price_per_night",
                    "guests",
                    "bedrooms",
                    "bathrooms",
                    "amenities",
                )
            },
        ),
        (
            "Availability",
            {"fields": ("is_available", "minimum_nights", "maximum_nights")},
        ),
        (
            "Stats",
            {"fields": ("average_rating", "review_count"), "classes": ("collapse",)},
        ),
        (
            "Metadata",
            {"fields": ("id", "created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ["property", "caption", "is_primary", "order"]
    list_filter = ["is_primary", "property"]
    search_fields = ["property__title", "caption"]


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = [
        "property",
        "guest",
        "check_in",
        "check_out",
        "guests_count",
        "total_price",
        "status",
        "created_at",
    ]
    list_filter = ["status", "payment_status", "created_at", "check_in"]
    search_fields = ["property__title", "guest__email", "guest__name"]
    readonly_fields = ["id", "nights", "created_at", "updated_at"]
    date_hierarchy = "check_in"

    fieldsets = (
        (
            "Reservation Info",
            {"fields": ("property", "guest", "check_in", "check_out", "guests_count")},
        ),
        ("Pricing", {"fields": ("total_price", "nights")}),
        ("Status", {"fields": ("status", "payment_status")}),
        (
            "Metadata",
            {"fields": ("id", "created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["property", "guest", "rating", "created_at"]
    list_filter = ["rating", "created_at"]
    search_fields = ["property__title", "guest__email", "comment"]
    readonly_fields = ["created_at"]


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ["user", "property", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__email", "property__title"]
    readonly_fields = ["created_at"]
