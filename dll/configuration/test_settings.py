from dll.configuration.settings import *

# remove 'haystack' from INSTALLED_APPS
INSTALLED_APPS = [app for app in INSTALLED_APPS if app != "haystack"]

MIDDLEWARE = [
    m for m in MIDDLEWARE if m != "dll.user.middleware.AcceptedTermsMiddleware"
]
