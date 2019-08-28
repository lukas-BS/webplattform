from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit

from django import forms
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy

from .models import DllUser


class EditUserForm(forms.ModelForm):
    class Meta:
        model = DllUser
        fields = ['email']


class SignUpForm(UserCreationForm):
    terms_accepted = forms.BooleanField(required=True)

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.add_input(
            Submit('submit', 'Absenden', css_class='button button--primary')
        )
        data_privacy_url = reverse_lazy('data-privacy')
        self.fields['terms_accepted'].label = f'Ja, ich stimme den <a href="/">Nutzungsbedingungen</a>- und den ' \
        f'<a href="{data_privacy_url}">Datenschutzbestimmungen</a> des digital.learning.lab zu.'
        self.fields['first_name'].required = True
        self.fields['last_name'].required = True
        self.fields['email'].required = True

    class Meta:
        model = DllUser
        fields = (
            'first_name',
            'last_name',
            'email',
            'terms_accepted',
            'password1',
            'password2',
        )
        labels = {
            'terms_accepted': 'Nutzungs- und Datenschutzbestimmungen'
        }

