from django.db import models
from django.conf import settings
from datetime import datetime


class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='categorias_imagenes', blank=True, null=True)

    def __str__(self):
        return self.nombre

class Lista(models.Model):
    nombre_documento = models.CharField(max_length=200,null=True, blank=True)
    archivo = models.FileField(upload_to='documentos', null=True, blank=True)

    def __str__(self):
        return self.nombre_documento

class Producto(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=200)
    fecha = models.DateTimeField(null=True, blank=True)
    descripcion = models.TextField()
    imagen1 = models.ImageField(upload_to='productos_imagenes',null=True, blank=True)
    imagen2 = models.ImageField(upload_to='productos_imagenes',null=True, blank=True)
    imagen3 = models.ImageField(upload_to='productos_imagenes', null=True, blank=True)
    imagen4 = models.ImageField(upload_to='productos_imagenes', null=True, blank=True)        
    head_colum1 = models.CharField(max_length=200, null=True, blank=True)
    head_colum2 = models.CharField(max_length=200, null=True, blank=True)
    head_colum3 = models.CharField(max_length=200, null=True, blank=True)
    colum1_row1 = models.CharField(max_length=200, null=True, blank=True)
    colum2_row1 = models.CharField(max_length=200, null=True, blank=True)
    colum3_row1 = models.CharField(max_length=200, null=True, blank=True)
    colum1_row2 = models.CharField(max_length=200, null=True, blank=True)
    colum2_row2 = models.CharField(max_length=200, null=True, blank=True)
    colum3_row2 = models.CharField(max_length=200, null=True, blank=True)
    colum1_row3 = models.CharField(max_length=200, null=True, blank=True)
    colum2_row3 = models.CharField(max_length=200, null=True, blank=True)
    colum3_row3 = models.CharField(max_length=200, null=True, blank=True)    
    colum1_row4 = models.CharField(max_length=200, null=True, blank=True)
    colum2_row4 = models.CharField(max_length=200, null=True, blank=True)
    colum3_row4 = models.CharField(max_length=200, null=True, blank=True)
    colum1_row5 = models.CharField(max_length=200, null=True, blank=True)
    colum2_row5 = models.CharField(max_length=200, null=True, blank=True)
    colum3_row5 = models.CharField(max_length=200, null=True, blank=True)
    colum1_row6 = models.CharField(max_length=200, null=True, blank=True)
    colum2_row6 = models.CharField(max_length=200, null=True, blank=True)
    colum3_row6 = models.CharField(max_length=200, null=True, blank=True)
    colum1_row7 = models.CharField(max_length=200, null=True, blank=True)
    colum2_row7 = models.CharField(max_length=200, null=True, blank=True)
    colum3_row7 = models.CharField(max_length=200, null=True, blank=True)
    colum1_row8 = models.CharField(max_length=200, null=True, blank=True)
    colum2_row8 = models.CharField(max_length=200, null=True, blank=True)
    colum3_row8 = models.CharField(max_length=200, null=True, blank=True)
    colum1_row9 = models.CharField(max_length=200, null=True, blank=True)
    colum2_row9 = models.CharField(max_length=200, null=True, blank=True)
    colum3_row9 = models.CharField(max_length=200, null=True, blank=True)
    colum1_row10 = models.CharField(max_length=200, null=True, blank=True)
    colum2_row10 = models.CharField(max_length=200, null=True, blank=True)
    colum3_row10 = models.CharField(max_length=200, null=True, blank=True)
    fondo = models.CharField(max_length=10, null=True, blank=True)
    etiquetas = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.nombre

    @property
    def costo_estructural(self):
        return settings.COSTO_ESTRUCTURAL

    @property
    def beneficio_esperado(self):
        return (float(self.precio_venta * self.stock)) - (float(self.costo_total) - (self.costo_estructural_esperado))

    @property
    def costo_total(self):
        return (self.costo_unitario * self.stock) 

    @property
    def beneficio_unitario(self):
        return (float(self.precio_venta) -  float(self.costo_unitario) - self.costo_estructural)

    @property
    def costo_estructural_esperado(self):
        return (self.costo_estructural* self.stock)


class Contacto(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, blank=True, null=True)
    nombre_usuario = models.CharField(max_length=200)
    identificacion_personal = models.CharField(max_length=20)
    telefono = models.CharField(max_length=15)
    enviado = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre_usuario


class Transaccion(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.BooleanField(blank=True, null=True)
    medio_pago = models.CharField(max_length=20)
    costo = models.DecimalField(max_digits=11, decimal_places=2, blank=True, default=0)
    costo_estructural = models.DecimalField(max_digits=11, decimal_places=2, blank=True, default=0)
    beneficio = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    descuento = models.DecimalField(max_digits=11, decimal_places=2, default=0)
    valor = models.DecimalField(max_digits=11, decimal_places=2)

    def __str__(self):
        return str(self.tipo)

    @property
    def valor_factura(self):
        return (self.valor + self.descuento)    


class TransaccionProducto(models.Model):
    id_transaccion = models.ForeignKey(Transaccion, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=200)
    costo_unitario = models.DecimalField(max_digits=11, decimal_places=2)
    costo_estructural = models.DecimalField(max_digits=11, decimal_places=2)
    precio_venta = models.DecimalField(max_digits=11, decimal_places=2)

    def __str__(self):
        return self.nombre

class TransaccionReporte(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    transaccion = models.ForeignKey(Transaccion, on_delete=models.CASCADE)
    estado = models.BooleanField(blank=True, null=True)
    nota = models.TextField()

    def __str__(self):
        return self.transaccion


class QuienesSomos(models.Model):
    imagen_corporativa = models.ImageField(upload_to='cover_imagenes')
    titulo_principal = models.CharField(max_length=200)
    descripcion_principal = models.TextField()
    titulo_secundario = models.CharField(max_length=200)
    descripcion_secundario = models.TextField()

    def __str__(self):
        return self.titulo_principal

class Cover(models.Model):
    empresa = models.CharField (max_length=100, null=True, blank=True)
    logo = models.ImageField(upload_to='cover_imagenes', null=True, blank=True)
    logo_footer = models.ImageField(upload_to='cover_imagenes', null=True, blank=True)
    descripcion = models.TextField(null=True, blank=True)
    whatsapp = models.CharField(max_length=10, null=True, blank=True)
    telefono = models.CharField(max_length=10, null=True, blank=True)
    ubicacion = models.URLField(max_length=500, null=True, blank=True)
    logo_patrocinador1 = models.ImageField(upload_to='cover_imagenes', null=True, blank=True)
    logo_patrocinador2 = models.ImageField(upload_to='cover_imagenes', null=True, blank=True)
    logo_patrocinador3 = models.ImageField(upload_to='cover_imagenes', null=True, blank=True)
    logo_patrocinador4 = models.ImageField(upload_to='cover_imagenes', null=True, blank=True)
    logo_patrocinador5 = models.ImageField(upload_to='cover_imagenes', null=True, blank=True)
    enlace_patrocinador1 = models.URLField(max_length=500, null=True, blank=True)
    enlace_patrocinador2 = models.URLField(max_length=500, null=True, blank=True)
    enlace_patrocinador3 = models.URLField(max_length=500, null=True, blank=True)
    enlace_patrocinador4 = models.URLField(max_length=500, null=True, blank=True)
    enlace_patrocinador5 = models.URLField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.ubicacion

