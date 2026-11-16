from rest_framework import serializers

from .models import Tour


class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = ["id", "name", "price", "duration", "departure", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_price(self, value):
        if value < 100_000:
            raise serializers.ValidationError("Giá tour  tối thiểu là 100.000 Đ.")
        return value
