from django.contrib import admin
from django.urls import path, include, re_path
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
    # ✅ Admin + Auth
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ✅ App APIs
    path("api/", include("users.urls")),
    path("api/", include("core.urls")),

    # ✅ API Docs
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),

    # ✅ React frontend fallback
    re_path(r"^$", ensure_csrf_cookie(TemplateView.as_view(template_name="index.html"))),
    re_path(r"^(?!api|admin|swagger|redoc|media|static).*$", ensure_csrf_cookie(TemplateView.as_view(template_name="index.html"))),
]

# ✅ Media file handling
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# ✅ Static file handling (for DEBUG=True only)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
