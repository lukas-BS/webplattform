# Generated by Django 2.2.9 on 2020-02-06 09:49

from django.db import migrations, models
from django.utils import timezone


def fix_missing_created_values(apps, schema_editor):
    Content = apps.get_model("content", "Content")
    for content in Content.objects.all():
        if not content.publisher_is_draft and not content.created:
            if content.publisher_linked and content.publisher_linked.modified:
                content.created = content.publisher_linked.modified
            else:
                content.created = timezone.now()
            content.save()


def unfix_missing_created_values(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0008_auto_20200206_1049"),
    ]

    operations = [
        migrations.RunPython(fix_missing_created_values, unfix_missing_created_values),
    ]
