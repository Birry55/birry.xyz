from django.forms import ModelForm
from sitio.models import *


class ContactoForm(ModelForm):
    class Meta:
        model = Contacto
        fields = '__all__'


class ProductoForm(ModelForm):
    class Meta:
        model = Producto
        fields = '__all__'

class CategoriaForm(ModelForm):
    class Meta:
        model = Categoria
        fields = '__all__'


class TransaccionForm(ModelForm):
    class Meta:
        model = Transaccion
        fields = '__all__'


class CoverForm(ModelForm):
    class Meta:
        model = Cover
        fields = '__all__'

class ListaForm(ModelForm):
    class Meta:
        model = Lista
        fields = '__all__'