from django.urls import path
from . import views

app_name = "useraccount"

urlpatterns = [
    path("profile/", views.UserProfileView.as_view(), name="user-profile"),
    path("register/", views.UserRegistrationView.as_view(), name="user-register"),
    path("change-password/", views.change_password, name="change-password"),
    path("become-host/", views.become_host, name="become-host"),
    path("stats/", views.user_stats, name="user-stats"),
]
