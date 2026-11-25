from django.contrib.auth.hashers import check_password, make_password
from django.db import models


class TaiKhoan(models.Model):
    """Thực thể TaiKhoan (mục V báo cáo tuần 3): khách hàng và quản trị viên."""

    class VaiTro(models.TextChoices):
        KHACH_HANG = "KHACH_HANG", "Khách hàng"
        QUAN_TRI = "QUAN_TRI", "Quản trị viên"

    class TrangThai(models.TextChoices):
        HOAT_DONG = "HOAT_DONG", "Hoạt động"
        BI_KHOA = "BI_KHOA", "Bị khóa"

    ma_tk = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=254, unique=True)
    mat_khau = models.CharField(max_length=255)  # chỉ lưu chuỗi ĐÃ BĂM
    ho_ten = models.CharField(max_length=100)
    so_dien_thoai = models.CharField(max_length=15, null=True, blank=True)
    dia_chi = models.CharField(max_length=255, null=True, blank=True)
    ngay_sinh = models.DateField(null=True, blank=True)
    vai_tro = models.CharField(max_length=20, choices=VaiTro.choices, default=VaiTro.KHACH_HANG)
    trang_thai = models.CharField(
        max_length=20, choices=TrangThai.choices, default=TrangThai.HOAT_DONG
    )
    ngay_tao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tai_khoan"  # trùng tên bảng trong schema.sql / ERD
        ordering = ["ma_tk"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(vai_tro__in=["KHACH_HANG", "QUAN_TRI"]),
                name="tai_khoan_vai_tro_hop_le",
            ),
            models.CheckConstraint(
                condition=models.Q(trang_thai__in=["HOAT_DONG", "BI_KHOA"]),
                name="tai_khoan_trang_thai_hop_le",
            ),
        ]

    # DRF (IsAuthenticated) hỏi thuộc tính này để biết request đã đăng nhập chưa
    is_authenticated = True

    def set_mat_khau(self, mat_khau_goc):
        self.mat_khau = make_password(mat_khau_goc)

    def kiem_tra_mat_khau(self, mat_khau_goc):
        return check_password(mat_khau_goc, self.mat_khau)

    def __str__(self):
        return self.email
