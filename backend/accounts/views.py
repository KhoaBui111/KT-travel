from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import TokenTaiKhoan
from .serializers import DangKySerializer, DangNhapSerializer, ThongTinTaiKhoanSerializer
from .token import tao_token


class DangKyView(generics.CreateAPIView):
    """POST /api/auth/register/  -> tạo tài khoản khách hàng mới."""

    serializer_class = DangKySerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # không cần đăng nhập, không kiểm tra CSRF phiên


class DangNhapView(APIView):
    """POST /api/auth/login/  -> kiểm tra email + mật khẩu, trả token."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = DangNhapSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tai_khoan = serializer.validated_data["tai_khoan"]
        return Response(
            {
                "token": tao_token(tai_khoan),
                "tai_khoan": ThongTinTaiKhoanSerializer(tai_khoan).data,
            },
            status=status.HTTP_200_OK,
        )


class ToiView(APIView):
    """GET /api/auth/me/  (gửi kèm Authorization: Bearer <token>) -> thông tin của tôi."""

    authentication_classes = [TokenTaiKhoan]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(ThongTinTaiKhoanSerializer(request.user).data)
