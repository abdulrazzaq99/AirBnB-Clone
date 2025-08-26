from django.urls import path
from . import views

app_name = "property"

urlpatterns = [
    # Property URLs
    path("", views.PropertyListCreateView.as_view(), name="property-list-create"),
    path("<uuid:pk>/", views.PropertyDetailView.as_view(), name="property-detail"),
    path(
        "user/properties/", views.UserPropertiesView.as_view(), name="user-properties"
    ),
    path("search/", views.property_search, name="property-search"),
    # Reservation URLs
    path("reservations/", views.ReservationListView.as_view(), name="reservation-list"),
    path("reservations/create/", views.create_reservation, name="create-reservation"),
    path(
        "reservations/<uuid:pk>/",
        views.ReservationDetailView.as_view(),
        name="reservation-detail",
    ),
    path(
        "reservations/<uuid:reservation_id>/cancel/",
        views.cancel_reservation,
        name="cancel-reservation",
    ),
    # Review URLs
    path(
        "<uuid:property_id>/reviews/",
        views.PropertyReviewsView.as_view(),
        name="property-reviews",
    ),
    # Wishlist URLs
    path("wishlist/", views.WishlistView.as_view(), name="wishlist"),
    path(
        "wishlist/<uuid:property_id>/remove/",
        views.remove_from_wishlist,
        name="remove-from-wishlist",
    ),
]
