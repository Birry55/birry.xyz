# Generated by Django 4.1 on 2022-10-03 22:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sitio', '0005_transaccionproducto_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaccionproducto',
            name='codigo_transaccion',
        ),
        migrations.AddField(
            model_name='transaccionproducto',
            name='id_transaccion',
            field=models.ForeignKey(default=-1, on_delete=django.db.models.deletion.CASCADE, to='sitio.transaccion'),
            preserve_default=False,
        ),
    ]
