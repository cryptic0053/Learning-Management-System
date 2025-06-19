from django.urls import path
from .views import user_list_create

urlpatterns = [
    # POST /api/register/ → Create a new user
    path("register/", user_list_create, name="register"),
]
