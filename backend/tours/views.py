from rest_framework import viewsets

from .models import Tour
from .serializers import TourListSerializer, TourSerializer


class TourViewSet(viewsets.ModelViewSet):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer

    def get_serializer_class(self):
        if self.action == "list":
            return TourListSerializer
        return TourSerializer
