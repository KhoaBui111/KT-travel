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

    def test_cors_cho_phep_frontend_vercel(self):
        res = self.client.get(self.url, HTTP_ORIGIN="https://kt-travel.vercel.app")
        self.assertEqual(
            res.headers["Access-Control-Allow-Origin"], "https://kt-travel.vercel.app"
        )

    def test_cors_chan_trang_la(self):
        res = self.client.get(self.url, HTTP_ORIGIN="https://trang-la.example.com")
        self.assertNotIn("Access-Control-Allow-Origin", res.headers)
