# lms_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.decorators.csrf import ensure_csrf_cookie


schema_view = get_schema_view(
    openapi.Info(
        title="LMS API",
        default_version="v1",
        description="Learning Management System API Documentation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT Auth
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # User and Core APIs
    path("api/", include("users.urls")),
    path("api/", include("core.urls")),

    # Swagger Docs
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),

    path("", ensure_csrf_cookie(TemplateView.as_view(template_name="index.html"))),
    path("<path:path>", ensure_csrf_cookie(TemplateView.as_view(template_name="index.html"))),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
