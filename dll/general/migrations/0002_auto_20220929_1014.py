# Generated by Django 3.2.15 on 2022-09-29 08:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('general', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='message',
            options={'get_latest_by': 'modified'},
        ),
        migrations.AlterModelOptions(
            name='newslettersubscription',
            options={'get_latest_by': 'modified'},
        ),
    ]
