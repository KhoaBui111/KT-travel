"""Đặt (hoặc đổi) mật khẩu cho 1 tài khoản, mật khẩu được băm trước khi lưu.

Cách dùng:  python manage.py dat_mat_khau admin@kttravel.vn
Mật khẩu được gõ ẩn (không hiện trên màn hình, không lưu vào lịch sử lệnh).
"""

from getpass import getpass

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError

from accounts.models import TaiKhoan


class Command(BaseCommand):
    help = "Đặt mật khẩu (đã băm) cho tài khoản theo email"

    def add_arguments(self, parser):
        parser.add_argument("email")

    def handle(self, *args, **options):
        tai_khoan = TaiKhoan.objects.filter(email__iexact=options["email"].strip()).first()
        if tai_khoan is None:
            raise CommandError("Không tìm thấy tài khoản với email này.")

        mat_khau = getpass("Mật khẩu mới: ")
        if mat_khau != getpass("Nhập lại: "):
            raise CommandError("Hai lần nhập không khớp.")
        try:
            validate_password(mat_khau)
        except ValidationError as loi:
            raise CommandError(" ".join(loi.messages)) from loi

        tai_khoan.set_mat_khau(mat_khau)
        tai_khoan.save(update_fields=["mat_khau"])
        thong_bao = f"Đã đặt mật khẩu cho {tai_khoan.email} ({tai_khoan.vai_tro})."
        self.stdout.write(self.style.SUCCESS(thong_bao))
