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
                terms_decline_url = reverse("user:terms-decline")
                if request.path not in [terms_check_url, terms_decline_url]:
                    return redirect(terms_check_url)
        response = self.get_response(request)
        return response
