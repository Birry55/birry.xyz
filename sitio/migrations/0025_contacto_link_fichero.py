# Generated by Django 4.1 on 2022-12-16 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sitio', '0024_alter_cover_audio_alter_cover_whatsapp'),
    ]

    operations = [
        migrations.AddField(
            model_name='contacto',
            name='link_fichero',
            field=models.URLField(blank=True, null=True),
        ),
    ]