# Generated by Django 3.2.15 on 2022-09-29 08:14

from django.db import migrations, models
import django_extensions.db.fields
import dll.general.models


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0021_historicalcontent_reason_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Potential",
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
                ("name", models.CharField(max_length=100)),
                ("description", models.CharField(max_length=600)),
                (
                    "slug",
                    dll.general.models.DllSlugField(
                        blank=True, editable=False, max_length=512, populate_from="name"
                    ),
                ),
            ],
            options={
                "get_latest_by": "modified",
                "abstract": False,
            },
        ),
        migrations.AlterModelOptions(
            name="contentfile",
            options={"get_latest_by": "modified"},
        ),
        migrations.AlterModelOptions(
            name="contentlink",
            options={"get_latest_by": "modified"},
        ),
        migrations.AlterModelOptions(
            name="helptext",
            options={"get_latest_by": "modified"},
        ),
        migrations.AlterModelOptions(
            name="historicalcontent",
            options={
                "get_latest_by": ("history_date", "history_id"),
                "ordering": ("-history_date", "-history_id"),
                "verbose_name": "historical Inhalt",
                "verbose_name_plural": "historical Inhalte",
            },
        ),
        migrations.AlterModelOptions(
            name="historicalteachingmodule",
            options={
                "get_latest_by": ("history_date", "history_id"),
                "ordering": ("-history_date", "-history_id"),
                "verbose_name": "historical Unterrichtsbaustein",
                "verbose_name_plural": "historical Unterrichtsbausteine",
            },
        ),
        migrations.AlterModelOptions(
            name="historicaltool",
            options={
                "get_latest_by": ("history_date", "history_id"),
                "ordering": ("-history_date", "-history_id"),
                "verbose_name": "historical Tool",
                "verbose_name_plural": "historical Tools",
            },
        ),
        migrations.AlterModelOptions(
            name="historicaltrend",
            options={
                "get_latest_by": ("history_date", "history_id"),
                "ordering": ("-history_date", "-history_id"),
                "verbose_name": "historical Trend",
                "verbose_name_plural": "historical Trends",
            },
        ),
        migrations.AlterModelOptions(
            name="review",
            options={"get_latest_by": "modified"},
        ),
        migrations.AlterModelOptions(
            name="toollink",
            options={"get_latest_by": "modified"},
        ),
        migrations.AlterModelOptions(
            name="trendlink",
            options={"get_latest_by": "modified"},
        ),
        migrations.AlterField(
            model_name="content",
            name="json_data",
            field=models.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name="historicalcontent",
            name="history_date",
            field=models.DateTimeField(db_index=True),
        ),
        migrations.AlterField(
            model_name="historicalcontent",
            name="json_data",
            field=models.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name="historicalteachingmodule",
            name="history_date",
            field=models.DateTimeField(db_index=True),
        ),
        migrations.AlterField(
            model_name="historicalteachingmodule",
            name="json_data",
            field=models.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name="historicaltool",
            name="history_date",
            field=models.DateTimeField(db_index=True),
        ),
        migrations.AlterField(
            model_name="historicaltool",
            name="json_data",
            field=models.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name="historicaltrend",
            name="history_date",
            field=models.DateTimeField(db_index=True),
        ),
        migrations.AlterField(
            model_name="historicaltrend",
            name="json_data",
            field=models.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name="review",
            name="json_data",
            field=models.JSONField(default=dict),
        ),
    ]
