from rest_framework import status
from rest_framework.test import APITestCase

from .models import TaiKhoan


class DangKyAPITest(APITestCase):
    url = "/api/auth/register/"

    def du_lieu(self, **kw):
        data = {
            "email": "khach@gmail.com",
            "mat_khau": "DuLich@2026",
            "ho_ten": "Nguyễn Văn A",
            "so_dien_thoai": "0912345678",
        }
        data.update(kw)
        return data

    def test_dang_ky_thanh_cong(self):
        res = self.client.post(self.url, self.du_lieu(), format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["email"], "khach@gmail.com")
        self.assertEqual(res.data["vai_tro"], "KHACH_HANG")
        self.assertNotIn("mat_khau", res.data)  # không lộ mật khẩu

    def test_mat_khau_duoc_bam(self):
        self.client.post(self.url, self.du_lieu(), format="json")
        tk = TaiKhoan.objects.get(email="khach@gmail.com")
        self.assertNotEqual(tk.mat_khau, "DuLich@2026")  # không lưu nguyên văn
        self.assertTrue(tk.kiem_tra_mat_khau("DuLich@2026"))

    def test_email_chuan_hoa_va_khong_trung(self):
        self.client.post(self.url, self.du_lieu(email="  Khach@Gmail.com "), format="json")
        res = self.client.post(self.url, self.du_lieu(email="KHACH@gmail.com"), format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.data["email"][0], "Email này đã được đăng ký.")
        self.assertEqual(TaiKhoan.objects.count(), 1)

    def test_tu_choi_mat_khau_yeu(self):
        for mk in ["1234567", "88888888", "password"]:
            res = self.client.post(self.url, self.du_lieu(mat_khau=mk), format="json")
            self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST, mk)
            self.assertIn("mat_khau", res.data)

    def test_khong_tu_dat_vai_tro_quan_tri(self):
        res = self.client.post(self.url, self.du_lieu(vai_tro="QUAN_TRI"), format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TaiKhoan.objects.get().vai_tro, "KHACH_HANG")

    def test_thieu_thong_tin_bat_buoc(self):
        res = self.client.post(self.url, {"email": "a@b.com"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        for f in ["mat_khau", "ho_ten"]:
            self.assertIn(f, res.data)

    def test_so_dien_thoai_sai(self):
        res = self.client.post(self.url, self.du_lieu(so_dien_thoai="09ab"), format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("so_dien_thoai", res.data)


class DangNhapAPITest(APITestCase):
    url = "/api/auth/login/"

    def setUp(self):
        self.tk = TaiKhoan(email="khach@gmail.com", ho_ten="Khách A")
        self.tk.set_mat_khau("DuLich@2026")
        self.tk.save()

    def dang_nhap(self, email="khach@gmail.com", mat_khau="DuLich@2026"):
        return self.client.post(self.url, {"email": email, "mat_khau": mat_khau}, format="json")

    def test_dang_nhap_dung_tra_token(self):
        res = self.dang_nhap(email="KHACH@gmail.com")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("token", res.data)
        self.assertEqual(res.data["tai_khoan"]["vai_tro"], "KHACH_HANG")
        self.assertNotIn("mat_khau", res.data["tai_khoan"])

    def test_sai_mat_khau_va_sai_email_cung_mot_thong_bao(self):
        r1 = self.dang_nhap(mat_khau="sai-roi-123")
        r2 = self.dang_nhap(email="khong@co.vn")
        self.assertEqual(r1.status_code, 400)
        self.assertEqual(r1.data, r2.data)

    def test_tai_khoan_bi_khoa(self):
        self.tk.trang_thai = TaiKhoan.TrangThai.BI_KHOA
        self.tk.save()
        self.assertEqual(self.dang_nhap().status_code, 400)

    def test_me_voi_token(self):
        token = self.dang_nhap().data["token"]
        res = self.client.get("/api/auth/me/", HTTP_AUTHORIZATION=f"Bearer {token}")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["email"], "khach@gmail.com")

    def test_me_khong_token_hoac_token_gia(self):
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)
        res = self.client.get("/api/auth/me/", HTTP_AUTHORIZATION="Bearer abc.xyz")
        self.assertEqual(res.status_code, 401)
