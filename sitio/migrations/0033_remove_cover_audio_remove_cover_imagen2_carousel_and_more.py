# Generated by Django 4.0.2 on 2023-07-15 04:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sitio', '0032_transaccion_descuento_alter_contacto_fichero_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cover',
            name='audio',
        ),
        migrations.RemoveField(
            model_name='cover',
            name='imagen2_carousel',
        ),
        migrations.RemoveField(
            model_name='cover',
            name='imagen3_carousel',
        ),
        migrations.RemoveField(
            model_name='cover',
            name='imagen4_carousel',
        ),
        migrations.RemoveField(
            model_name='producto',
            name='precio',
        ),
        migrations.AddField(
            model_name='cover',
            name='correo',
            field=models.EmailField(blank=True, max_length=40, null=True),
        ),
        migrations.AddField(
            model_name='cover',
            name='descripcion',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='cover',
            name='frase',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='cover',
            name='telefono',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='cover',
            name='twitter',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='producto',
            name='archivopdf',
            field=models.FileField(blank=True, null=True, upload_to='documentos'),
        ),
        migrations.AddField(
            model_name='producto',
            name='ubicacion_producto',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]