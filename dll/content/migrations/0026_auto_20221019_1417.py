# Generated by Django 3.2.15 on 2022-10-19 12:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("sites", "0002_alter_domain_unique"),
        ("content", "0025_tool_potentials"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="testimonial",
            options={"permissions": (("can_publish", "Can publish"),)},
        ),
        migrations.AddField(
            model_name="testimonial",
            name="publisher_is_draft",
            field=models.BooleanField(db_index=True, default=True, editable=False),
        ),
        migrations.AddField(
            model_name="testimonial",
            name="publisher_linked",
            field=models.OneToOneField(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="publisher_draft",
                to="content.testimonial",
            ),
        ),
        migrations.AlterField(
            model_name="content",
            name="site",
            field=models.ForeignKey(
                default=2, on_delete=django.db.models.deletion.CASCADE, to="sites.site"
            ),
        ),
        migrations.AlterField(
            model_name="historicalcontent",
            name="site",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                default=2,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                to="sites.site",
            ),
        ),
        migrations.AlterField(
            model_name="historicalteachingmodule",
            name="site",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                default=2,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                to="sites.site",
            ),
        ),
        migrations.AlterField(
            model_name="historicaltool",
            name="site",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                default=2,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                to="sites.site",
            ),
        ),
        migrations.AlterField(
            model_name="historicaltrend",
            name="site",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                default=2,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                to="sites.site",
            ),
        ),
    ]
