# Generated by Django 2.2.14 on 2020-07-14 15:08

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc
import django_extensions.db.fields


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0010_auto_20200629_1606"),
    ]

    operations = [
        migrations.AlterField(
            model_name="content",
            name="author",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
                verbose_name="Ersteller",
            ),
        ),
        migrations.AlterField(
            model_name="content",
            name="created",
            field=django_extensions.db.fields.CreationDateTimeField(
                auto_now_add=True,
                default=datetime.datetime(2020, 7, 14, 15, 8, 51, 946054, tzinfo=utc),
                null=True,
                verbose_name="created",
            ),
        ),
    ]
