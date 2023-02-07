# Generated by Django 3.2.15 on 2022-11-23 14:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import dll.user.utils


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("content", "0030_auto_20221114_1650"),
    ]

    operations = [
        migrations.CreateModel(
            name="TestimonialReview",
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
                    "status",
                    models.IntegerField(
                        choices=[
                            (0, "Neu"),
                            (1, "In Bearbeitung"),
                            (4, "Änderungen angefragt"),
                            (2, "Akzeptiert"),
                            (3, "Abgelehnt"),
                        ],
                        default=0,
                    ),
                ),
                ("comment", models.TextField(verbose_name="Kommentar")),
                ("is_active", models.BooleanField(default=False)),
                (
                    "accepted_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=models.SET(dll.user.utils.get_default_tuhh_user),
                        related_name="accepted_tetsimonial_reviews",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "assigned_reviewer",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="assigned_tetsimonial_reviews",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Assigned Reviewer",
                    ),
                ),
                (
                    "declined_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=models.SET(dll.user.utils.get_default_tuhh_user),
                        related_name="declined_tetsimonial_reviews",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "submitted_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=models.SET(dll.user.utils.get_default_tuhh_user),
                        related_name="submitted_tetsimonial_reviews",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "testimonial",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reviews",
                        to="content.testimonial",
                    ),
                ),
            ],
            options={
                "get_latest_by": "modified",
                "abstract": False,
            },
        ),
    ]
