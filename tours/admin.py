from django.contrib import admin
from .models import Tour


@admin.register(Tour)
class Touradmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "duration", "departure", "created_at")
    search_fields = ("name", "departure")
