# Generated by Django 2.2.4 on 2019-09-12 15:30

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="CommunicationEventType",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    django_extensions.db.fields.CreationDateTimeField(
                        auto_now_add=True, verbose_name="created"
                    ),
                ),
                (
                    "modified",
                    django_extensions.db.fields.ModificationDateTimeField(
                        auto_now=True, verbose_name="modified"
                    ),
                ),
                (
                    "code",
                    models.CharField(
                        help_text="Code, mit dem dieses Ereignis programmgesteuert gesucht werden kann.",
                        max_length=128,
                        unique=True,
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="Dies dient nur zu organisatorischen Zwecken.",
                        max_length=255,
                        verbose_name="Name",
                    ),
                ),
                (
                    "from_email",
                    models.EmailField(
                        default="digital.learning.lab@tuhh.de", max_length=128
                    ),
                ),
                (
                    "email_subject_template",
                    models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                        verbose_name="Email Subject Template",
                    ),
                ),
                (
                    "email_body_template",
                    models.TextField(
                        blank=True, null=True, verbose_name="Email Body Template"
                    ),
                ),
                (
                    "email_body_html_template",
                    models.TextField(
                        blank=True,
                        help_text="HTML template",
                        null=True,
                        verbose_name="Email Body HTML Template",
                    ),
                ),
            ],
            options={
                "verbose_name": "Art des Kommunikations-Ereignis",
                "verbose_name_plural": "Arten von Kommunikations-Ereignissen",
            },
        ),
        migrations.CreateModel(
            name="NewsletterSubscrption",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    django_extensions.db.fields.CreationDateTimeField(
                        auto_now_add=True, verbose_name="created"
                    ),
                ),
                (
                    "modified",
                    django_extensions.db.fields.ModificationDateTimeField(
                        auto_now=True, verbose_name="modified"
                    ),
                ),
                ("email", models.EmailField(max_length=254)),
                ("doi_confirmed", models.BooleanField(default=False)),
                ("doi_confirmed_date", models.DateTimeField(editable=False, null=True)),
                (
                    "checked_text",
                    models.CharField(blank=True, max_length=300, null=True),
                ),
            ],
            options={
                "ordering": ("-modified", "-created"),
                "get_latest_by": "modified",
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="CommunicationEvent",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    django_extensions.db.fields.CreationDateTimeField(
                        auto_now_add=True, verbose_name="created"
                    ),
                ),
                (
                    "modified",
                    django_extensions.db.fields.ModificationDateTimeField(
                        auto_now=True, verbose_name="modified"
                    ),
                ),
                ("from_email", models.CharField(max_length=128)),
                (
                    "to",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.EmailField(max_length=254), size=None
                    ),
                ),
                (
                    "cc",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.EmailField(max_length=254),
                        null=True,
                        size=None,
                    ),
                ),
                (
                    "bcc",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.EmailField(max_length=254),
                        null=True,
                        size=None,
                    ),
                ),
                (
                    "event_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="communication.CommunicationEventType",
                        verbose_name="Event Type",
                    ),
                ),
                (
                    "sender",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="communication_events",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Auslösender User",
                    ),
                ),
            ],
            options={
                "verbose_name": "Kommunikations-Ereignis",
                "verbose_name_plural": "Kommunikations-Ereignisse",
                "ordering": ["-created"],
            },
        ),
        migrations.CreateModel(
            name="CoAuthorshipInvitation",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    django_extensions.db.fields.CreationDateTimeField(
                        auto_now_add=True, verbose_name="created"
                    ),
                ),
                (
                    "modified",
                    django_extensions.db.fields.ModificationDateTimeField(
                        auto_now=True, verbose_name="modified"
                    ),
                ),
                ("accepted", models.BooleanField(null=True, verbose_name="Status")),
                (
                    "message",
                    models.TextField(
                        max_length=500, null=True, verbose_name="Nachricht"
                    ),
                ),
                (
                    "by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="sent_invitations",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Einladung von",
                    ),
                ),
            ],
            options={
                "ordering": ("-modified", "-created"),
                "get_latest_by": "modified",
                "abstract": False,
            },
        ),
    ]
