"""Đọc header "Authorization: Bearer <token>" để biết ai đang gọi API."""

from rest_framework import authentication, exceptions

from .models import TaiKhoan
from .token import doc_token


class TokenTaiKhoan(authentication.BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).decode()
        if not header.startswith(self.keyword + " "):
            return None  # không gửi token -> coi như khách vãng lai

        ma_tk = doc_token(header[len(self.keyword) + 1 :].strip())
        if ma_tk is None:
            raise exceptions.AuthenticationFailed("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.")

        tai_khoan = TaiKhoan.objects.filter(ma_tk=ma_tk).first()
        if tai_khoan is None or tai_khoan.trang_thai != TaiKhoan.TrangThai.HOAT_DONG:
            raise exceptions.AuthenticationFailed("Tài khoản không tồn tại hoặc đã bị khóa.")
        return (tai_khoan, None)

    def authenticate_header(self, request):
        return self.keyword  # để DRF trả 401 thay vì 403 khi thiếu token
