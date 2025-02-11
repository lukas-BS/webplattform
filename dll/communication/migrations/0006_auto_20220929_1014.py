# Generated by Django 3.2.15 on 2022-09-29 08:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("communication", "0005_create_change_email_event_type"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="coauthorshipinvitation",
            options={"get_latest_by": "modified"},
        ),
        migrations.AlterField(
            model_name="communicationeventtype",
            name="from_email",
            field=models.EmailField(default="j.doe@example.com", max_length=128),
        ),
    ]
