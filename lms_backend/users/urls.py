from django.urls import path
from .views import user_list_create

urlpatterns = [
    path('users/', user_list_create, name='user-list-create'),
]