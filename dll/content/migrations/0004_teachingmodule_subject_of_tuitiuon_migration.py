# Generated by Django 2.2.9 on 2020-01-13 15:16

from django.db import migrations, models


def forwards_func(apps, schema_editor):
    TeachingModule = apps.get_model("content", "TeachingModule")
    db_alias = schema_editor.connection.alias
    tms = TeachingModule.objects.using(db_alias).all()
    for tm in tms:
        tm.subject_of_tuition_migration = " ".join(tm.subject_of_tuition)
        tm.save()


def reverse_func(apps, schema_editor):
    TeachingModule = apps.get_model("content", "TeachingModule")
    db_alias = schema_editor.connection.alias
    tms = TeachingModule.objects.using(db_alias).all()
    for tm in tms:
        tm.subject_of_tuition = [tm.subject_of_tuition_migration]
        tm.save()


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0003_auto_20200113_1540"),
    ]

    operations = [
        migrations.AddField(
            model_name="teachingmodule",
            name="subject_of_tuition_migration",
            field=models.TextField(max_length=2000, null=True, blank=True),
        ),
        migrations.RunPython(
            code=forwards_func, reverse_code=reverse_func, atomic=True
        ),
        migrations.RemoveField(model_name="teachingmodule", name="subject_of_tuition"),
        migrations.RenameField(
            model_name="teachingmodule",
            old_name="subject_of_tuition_migration",
            new_name="subject_of_tuition",
        ),
    ]
