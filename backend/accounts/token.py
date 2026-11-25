"""Tạo và kiểm tra token đăng nhập.

Token = mã tài khoản + thời điểm tạo, được KÝ bằng DJANGO_SECRET_KEY.
- Không cần bảng lưu token (stateless).
- Ai sửa token thì chữ ký sai -> bị từ chối.
- Token hết hạn sau TOKEN_HET_HAN giây.
"""

from django.core import signing

SALT = "kt-travel.dang-nhap"
TOKEN_HET_HAN = 60 * 60 * 24 * 7  # 7 ngày


def tao_token(tai_khoan):
    return signing.dumps({"ma_tk": tai_khoan.ma_tk}, salt=SALT)


def doc_token(token):
    """Trả về ma_tk nếu token hợp lệ, ngược lại trả về None."""
    try:
        du_lieu = signing.loads(token, salt=SALT, max_age=TOKEN_HET_HAN)
    except signing.BadSignature:  # gồm cả SignatureExpired
        return None
    return du_lieu.get("ma_tk")
