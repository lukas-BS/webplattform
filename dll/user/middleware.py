from django.shortcuts import redirect
from django.urls import reverse


class AcceptedTermsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = request.user
        if user.is_authenticated:
            if not user.terms_accepted or not user.personal_data:
                terms_check_url = reverse("user:terms-check")
                if request.path != terms_check_url:
                    return redirect(terms_check_url)
        response = self.get_response(request)
        return response
