from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from tours.views import TourViewSet

router = DefaultRouter()
router.register(r"tours", TourViewSet, basename="tour")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/", include(router.urls)),
]
