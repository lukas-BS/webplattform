from django.urls import re_path
from . import views

urlpatterns = [
    re_path(r"^(?P<message>.+).js$", views.shared_session_view, name="share"),
]

urls = urlpatterns, "shared_session", "shared_session"
