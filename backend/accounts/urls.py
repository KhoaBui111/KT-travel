from django.urls import path

from .views import DangKyView, DangNhapView, ToiView

urlpatterns = [
    path("register/", DangKyView.as_view(), name="dang-ky"),
    path("login/", DangNhapView.as_view(), name="dang-nhap"),
    path("me/", ToiView.as_view(), name="toi"),
]
