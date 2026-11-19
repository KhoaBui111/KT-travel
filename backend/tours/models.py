from django.db import models


class Tour(models.Model):
    name = models.CharField(max_length=200)
    price = models.PositiveIntegerField()
    duration = models.CharField(max_length=50)
    departure = models.CharField(max_length=100)
    # Hãng / phương tiện (VD: VietJet, Vietnam Airlines, Xe khách)
    airline = models.CharField(max_length=100, blank=True, default="")
    # Lịch trình / mô tả chi tiết
    description = models.TextField(blank=True, default="")
    # Điểm nổi bật: danh sách chuỗi
    highlights = models.JSONField(blank=True, default=list)
    # Ngày khởi hành: danh sách chuỗi "YYYY-MM-DD"
    dates = models.JSONField(blank=True, default=list)
    # Hình ảnh: danh sách URL hoặc data URL (base64); ảnh đầu tiên là ảnh đại diện
    gallery = models.JSONField(blank=True, default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
