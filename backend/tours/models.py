from django.db import models


class Tour(models.Model):
    name = models.CharField(max_length=200)
    price = models.PositiveIntegerField()
    duration = models.CharField(max_length=50)
    departure = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
