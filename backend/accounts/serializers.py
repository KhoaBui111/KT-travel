from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import TaiKhoan


class DangKySerializer(serializers.ModelSerializer):
    # Tự kiểm tra trùng email (không phân biệt hoa thường) trong validate_email
    email = serializers.EmailField(max_length=254)
    # write_only: nhận vào nhưng KHÔNG BAO GIỜ trả mật khẩu ra ngoài
    mat_khau = serializers.CharField(write_only=True, min_length=8, max_length=128)

    class Meta:
        model = TaiKhoan
        fields = ["ma_tk", "email", "mat_khau", "ho_ten", "so_dien_thoai", "vai_tro", "ngay_tao"]
        read_only_fields = ["ma_tk", "vai_tro", "ngay_tao"]  # khách không tự đặt vai trò

    def validate_email(self, value):
        email = value.strip().lower()
        if TaiKhoan.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("Email này đã được đăng ký.")
        return email

    def validate_ho_ten(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Vui lòng nhập họ tên.")
        return value

    def validate_so_dien_thoai(self, value):
        value = (value or "").strip()
        if value and (not value.isdigit() or not 9 <= len(value) <= 11):
            raise serializers.ValidationError("Số điện thoại phải gồm 9-11 chữ số.")
        return value or None

    def validate_mat_khau(self, value):
        try:
            validate_password(value)  # quy tắc mật khẩu trong settings.AUTH_PASSWORD_VALIDATORS
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def create(self, validated_data):
        mat_khau_goc = validated_data.pop("mat_khau")
        tk = TaiKhoan(**validated_data)  # vai_tro mặc định KHACH_HANG
        tk.set_mat_khau(mat_khau_goc)
        tk.save()
        return tk


class DangNhapSerializer(serializers.Serializer):
    email = serializers.EmailField()
    mat_khau = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs["email"].strip().lower()
        tai_khoan = TaiKhoan.objects.filter(email__iexact=email).first()
        # Cùng 1 câu báo lỗi cho "sai email" và "sai mật khẩu"
        # để kẻ xấu không dò được email nào đã đăng ký
        if tai_khoan is None or not tai_khoan.kiem_tra_mat_khau(attrs["mat_khau"]):
            raise serializers.ValidationError("Email hoặc mật khẩu không đúng.")
        if tai_khoan.trang_thai != TaiKhoan.TrangThai.HOAT_DONG:
            raise serializers.ValidationError(
                "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."
            )
        attrs["tai_khoan"] = tai_khoan
        return attrs


class ThongTinTaiKhoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaiKhoan
        fields = ["ma_tk", "email", "ho_ten", "so_dien_thoai", "vai_tro", "trang_thai", "ngay_tao"]
        read_only_fields = fields
