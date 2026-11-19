from datetime import date

from rest_framework import serializers

from .models import Tour

MAX_IMAGES = 10
MAX_IMAGE_LENGTH = 3_000_000  # ~2 MB ảnh sau khi mã hoá base64


class TourSerializer(serializers.ModelSerializer):
    # Ảnh đại diện = ảnh đầu tiên trong gallery (chỉ đọc)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = [
            "id",
            "name",
            "price",
            "duration",
            "departure",
            "airline",
            "description",
            "highlights",
            "dates",
            "gallery",
            "image",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_image(self, obj):
        return obj.gallery[0] if obj.gallery else None

    def validate_price(self, value):
        if value < 100_000:
            raise serializers.ValidationError("Giá tour tối thiểu là 100.000 Đ.")
        return value

    def _string_list(self, value):
        if not isinstance(value, list) or not all(isinstance(v, str) for v in value):
            raise serializers.ValidationError("Phải là danh sách chuỗi.")
        return [v.strip() for v in value if v.strip()]

    def validate_highlights(self, value):
        return self._string_list(value)

    def validate_dates(self, value):
        value = self._string_list(value)
        for d in value:
            try:
                date.fromisoformat(d)
            except ValueError:
                raise serializers.ValidationError(f"Ngày không hợp lệ: {d} (cần YYYY-MM-DD).")
        return sorted(set(value))

    def validate_gallery(self, value):
        value = self._string_list(value)
        if len(value) > MAX_IMAGES:
            raise serializers.ValidationError(f"Tối đa {MAX_IMAGES} ảnh.")
        for img in value:
            if not img.startswith(("http://", "https://", "/", "data:image/")):
                raise serializers.ValidationError("Ảnh phải là đường dẫn URL hoặc file ảnh.")
            if len(img) > MAX_IMAGE_LENGTH:
                raise serializers.ValidationError("Có ảnh quá lớn (tối đa ~2 MB).")
        return value


class TourListSerializer(TourSerializer):
    """Danh sách tour: bỏ gallery để response nhẹ, chỉ giữ ảnh đại diện."""

    class Meta(TourSerializer.Meta):
        fields = [f for f in TourSerializer.Meta.fields if f != "gallery"]
