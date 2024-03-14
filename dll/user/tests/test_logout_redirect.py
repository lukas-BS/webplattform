import pytest
from django.test import Client, TestCase


class TestLogout(TestCase):
    def test_logout_redirect(self):
        client = Client()
        response = client.post("/logout/")
        self.assertRedirects(response, "/")
