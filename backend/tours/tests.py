from rest_framework import status
from rest_framework.test import APITestCase

from .models import Tour


class TourAPITest(APITestCase):
    url = "/api/tours/"

    def setUp(self):
        self.tour = Tour.objects.create(
            name="Đà Lạt 3N2Đ",
            price=2_990_000,
            duration="3 ngày 2 đêm",
            departure="TP. Hồ Chí Minh",
        )

    def test_lay_danh_sach(self):
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    def test_tao_tour_hop_le(self):
        data = {
            "name": "Phú Quốc 4N3Đ",
            "price": 5_490_000,
            "duration": "4 ngày 3 đêm",
            "departure": "Hà Nội",
        }
        res = self.client.post(self.url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tour.objects.count(), 2)

    def test_tu_choi_gia_qua_thap(self):
        data = {"name": "Tour lỗi", "price": 5_000, "duration": "1 ngày", "departure": "Huế"}
        res = self.client.post(self.url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("price", res.data)

    def test_sua_gia(self):
        res = self.client.patch(f"{self.url}{self.tour.id}/", {"price": 3_490_000}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.tour.refresh_from_db()
        self.assertEqual(self.tour.price, 3_490_000)

    def test_xoa_tour(self):
        res = self.client.delete(f"{self.url}{self.tour.id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Tour.objects.filter(id=self.tour.id).exists())

    def test_sua_ngay_lich_trinh_anh_hang(self):
        data = {
            "airline": "VietJet",
            "description": "Ngày 1: Đón khách. Ngày 2: Tham quan.",
            "highlights": ["Hồ Xuân Hương", " ", "Chợ đêm"],
            "dates": ["2026-12-20", "2026-12-01"],
            "gallery": ["https://example.com/a.jpg", "data:image/jpeg;base64,AAAA"],
        }
        res = self.client.patch(f"{self.url}{self.tour.id}/", data, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK, res.data)
        self.tour.refresh_from_db()
        self.assertEqual(self.tour.airline, "VietJet")
        self.assertEqual(self.tour.highlights, ["Hồ Xuân Hương", "Chợ đêm"])
        self.assertEqual(self.tour.dates, ["2026-12-01", "2026-12-20"])
        self.assertEqual(len(self.tour.gallery), 2)
        self.assertEqual(res.data["image"], "https://example.com/a.jpg")

    def test_tu_choi_ngay_sai_dinh_dang(self):
        res = self.client.patch(
            f"{self.url}{self.tour.id}/", {"dates": ["20/12/2026"]}, format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("dates", res.data)

    def test_tu_choi_anh_khong_hop_le(self):
        res = self.client.patch(
            f"{self.url}{self.tour.id}/", {"gallery": ["javascript:alert(1)"]}, format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_danh_sach_khong_tra_gallery(self):
        self.tour.gallery = ["https://example.com/a.jpg"]
        self.tour.save()
        res = self.client.get(self.url)
        self.assertNotIn("gallery", res.data[0])
        self.assertEqual(res.data[0]["image"], "https://example.com/a.jpg")

    def test_cors_cho_phep_frontend_vercel(self):
        res = self.client.get(self.url, HTTP_ORIGIN="https://kt-travel.vercel.app")
        self.assertEqual(
            res.headers["Access-Control-Allow-Origin"], "https://kt-travel.vercel.app"
        )

    def test_cors_chan_trang_la(self):
        res = self.client.get(self.url, HTTP_ORIGIN="https://trang-la.example.com")
        self.assertNotIn("Access-Control-Allow-Origin", res.headers)
