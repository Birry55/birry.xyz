# Generated by Django 4.1 on 2022-11-07 22:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sitio', '0011_alter_transaccion_beneficio_alter_transaccion_costo_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='contacto',
            old_name='efectuado',
            new_name='estado',
        ),
        migrations.AddField(
            model_name='transaccion',
            name='ocultada',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]