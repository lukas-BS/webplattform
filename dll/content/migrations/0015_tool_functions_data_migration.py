# Generated by Django 2.2.14 on 2020-08-03 13:11

from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields


def add_tool_functions(apps, schema_editor):
    ToolFunction = apps.get_model("content", "ToolFunction")
    titles = [
        "Inhalte",
        "Visualisierung & Simulation",
        "Produzieren",
        "Probleme lösen",
        "Kommunizieren",
        "Kooperieren",
        "Ordnen & Strukturieren",
        "Diagnose & Test",
        "Reflexion",
        "Spielerisch lernen",
    ]
    for title in titles:
        ToolFunction.objects.create(title=title)


def remove_tool_functions(apps, schema_editor):
    ToolFunction = apps.get_model("content", "ToolFunction")
    ToolFunction.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0014_auto_20200803_1511"),
    ]

    operations = [migrations.RunPython(add_tool_functions, remove_tool_functions)]
