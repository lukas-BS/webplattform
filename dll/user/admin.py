from django.contrib import admin
from .models import DllUser


@admin.register(DllUser)
class DllUserAdmin(admin.ModelAdmin):
    exclude = ("json_data",)
    search_fields = ["first_name", "last_name", "username", "email"]
