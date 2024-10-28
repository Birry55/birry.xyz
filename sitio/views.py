from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, FileResponse
from django.urls import reverse
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.http import require_GET, require_POST
from django.conf import settings
from django.core.files import File
from django.utils import timezone
from random import choice
from datetime import datetime
from datetime import timedelta
import os
from sitio.forms import *
from sitio.models import *

HORA_OCULTO = timezone.now() - timedelta(hours=12)


@require_GET
def autenticacion(request):
    return render(request, 'sitio/login.html')


@require_POST
def autenticar(request):
    usuario = authenticate(username=request.POST['usuario'], password=request.POST['password'])
    if usuario is not None:
        login(request, usuario)
        return HttpResponseRedirect(reverse('sitio:inicio'))
    else:
        error = 'Sus datos de ingreso no son válidos'
        return render(request, 'sitio/login.html', {'error': error})

@require_GET
@login_required
def cerrar_sesion(request):
    logout(request)
    mensaje = "Usted ha cerrado sesión"
    return render(request, 'sitio/login.html', {'mensaje': mensaje})


@require_GET
@login_required
def inicio(request):
    return render(request, 'sitio/index.html')

@require_GET
@login_required
def contactos(request):
    contexto ={}
    contexto['contactos'] = Contacto.objects.filter(enviado=False).order_by('-fecha')
    return render(request, 'sitio/contactos.html', contexto)

@require_GET
def solicitar_contacto(request, pk):
    contexto = {}
    producto = get_object_or_404(Producto, pk=pk)
    contexto['producto'] = producto
    return render(request, 'publico/solicitar_contacto.html', contexto)

@require_POST
def guardar_contacto(request):
    contexto = {}
    datos = {}
    letras = ('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z')
    numeros = (0,1,2,3,4,5,6,7,8,9)
    formulario = ContactoForm(request.POST)
    if formulario.is_valid():
        producto = Producto.objects.get(id=request.POST['id_producto'])
        contactos = Contacto.objects.filter(producto=producto.id)
        for i in contactos:
            if request.POST['identificacion_personal'] == i.identificacion_personal:
                contexto['mensaje'] = 'Esta identificación ya fue registrada para este evento, su entrada no pudo ser procesada con éxito'
                contexto['producto'] = producto
                return render(request, 'publico/solicitar_contacto.html', contexto)
        contacto = contacto = formulario.save()
        contacto.producto = producto
        contacto.enviado = False
        datos['producto'] = producto
        datos['contacto'] = contacto
        contacto.save()
        contexto['producto'] = producto
        contexto['mensaje'] = 'Su información ha sido enviada con éxito, en breve te contactaremos'
        return render(request, 'publico/solicitar_contacto.html', contexto)
    else:
        contexto['mensaje'] = formulario.errors
        return render(request, 'publico/solicitar_contacto.html', contexto)

@require_GET
@login_required
def marcar_enviado(request, pk):
    contacto = get_object_or_404(Contacto, pk=pk)
    contacto.enviado = True
    contacto.save()
    return HttpResponseRedirect(reverse('sitio:contactos'))


@require_GET
def categoria(request, pk):
    contexto = {}
    productos = Producto.objects.filter(categoria=pk)
    productos = productos.exclude(fecha__lte=HORA_OCULTO)
    contexto['productos'] = productos
    contexto['categorias'] = Categoria.objects.all()
    covers = Cover.objects.all()
    try:
        contexto['cover'] = covers[0]
    except IndexError:
        contexto['no_cover'] = True
    contexto['categoria'] = Categoria.objects.get(id=pk)
    return render(request, 'publico/productos.html', contexto)

@require_GET
@login_required
def web_productos(request):
    contexto = {}
    productos = Producto.objects.exclude(fecha__lte=HORA_OCULTO)
    productos = productos.order_by('categoria')
    contexto['productos'] = productos
    contexto['categorias'] = Categoria.objects.all()
    return render(request, 'sitio/web_productos.html', contexto)

@require_POST
@login_required
def filtro_categoria(request):
    contexto = {}
    if request.POST['categoria'] == '':
        return HttpResponseRedirect(reverse('sitio:productos'))
    productos = Producto.objects.filter(categoria=request.POST['categoria'])
    productos = productos.exclude(fecha__lte=HORA_OCULTO)
    contexto['productos'] = productos
    contexto['categorias'] = Categoria.objects.all()
    return render(request, 'sitio/web_productos.html', contexto)

def proximos_eventos(fecha=timezone.now()):
    productos = Producto.objects.filter(fecha__gt=HORA_OCULTO)

    return productos

@require_POST
@login_required
def guardar_producto(request):
    contexto = {}
    formulario = ProductoForm(request.POST, request.FILES)
    if formulario.is_valid():
        formulario.save()
        contexto['mensaje'] = 'La Información del Producto fue guardada con éxito'
        productos = Producto.objects.exclude(fecha__lte=HORA_OCULTO)
        productos = productos.order_by('categoria')
        contexto['productos'] = productos
        contexto['categorias'] = Categoria.objects.all()
        return render(request, 'sitio/web_productos.html', contexto)
    else:
        contexto['mensaje'] = formulario.errors
        productos = Producto.objects.exclude(fecha__lte=HORA_OCULTO)
        productos = productos.order_by('categoria')
        contexto['productos'] = productos
        contexto['categorias'] = Categoria.objects.all()
        return render(request, 'sitio/web_productos.html', contexto)

@require_POST
@login_required
def editar_producto(request, pk):
    contexto = {}
    try:
        producto = Producto.objects.get(id=pk)
    except Producto.DoesNotExist:
        productos = Producto.objects.exclude(fecha__lte=HORA_OCULTO)
        productos = productos.order_by('categoria')
        contexto['productos'] = productos
        contexto['categorias'] = Categoria.objects.all()
        contexto['mensaje'] = 'El registro no pudo ser actualizado o no existe'
        return render(request, 'sitio/web_productos.html', contexto)
    formulario = ProductoForm(request.POST, request.FILES, instance=producto)
    if formulario.is_valid():
        formulario.save()
        productos = Producto.objects.exclude(fecha__lte=HORA_OCULTO)
        productos = productos.order_by('categoria')
        contexto['productos'] = productos
        contexto['categorias'] = Categoria.objects.all()
        contexto['mensaje'] = 'El registro del Producto se ha actualizado con éxito'
        return render(request, 'sitio/web_productos.html', contexto)
    else:
        productos = Producto.objects.exclude(fecha__lte=HORA_OCULTO)
        productos = productos.order_by('categoria')
        contexto['productos'] = productos
        contexto['categorias'] = Categoria.objects.all()
        contexto['mensaje'] = formulario.errors
        return render(request, 'sitio/web_productos.html', contexto)

@require_GET
@login_required
def eliminar_producto(request, pk):
    contexto = {}
    try:
        producto = Producto.objects.get(id=pk).delete()
    except Producto.DoesNotExist:
        contexto['mensaje'] = 'El registro no pudo ser borrado o no existe'
        productos = Producto.objects.exclude(fecha__lte=HORA_OCULTO)
        productos = productos.order_by('categoria')
        contexto['productos'] = productos
        contexto['categorias'] = Categoria.objects.all()
        return render(request, 'sitio/web_productos.html', contexto)
    contexto['mensaje'] = 'Registro de Producto borrado con éxito'
    productos = Producto.objects.exclude(fecha__lte=HORA_OCULTO)
    productos = productos.order_by('categoria')
    contexto['productos'] = productos
    contexto['categorias'] = Categoria.objects.all()
    return render(request, 'sitio/web_productos.html', contexto)


@require_GET
@login_required
def web_categorias(request):
    contexto = {}
    contexto['categorias'] = Categoria.objects.all()
    return render(request, 'sitio/web_categorias.html', contexto)

@require_POST
@login_required
def guardar_categoria(request):
    contexto = {}
    formulario = CategoriaForm(request.POST, request.FILES)
    if formulario.is_valid():
        formulario.save()
        contexto['mensaje'] = 'La Información de la Categoría fue guardada con éxito'
        contexto['categorias'] = Categoria.objects.all()
        return render(request, 'sitio/web_categorias.html', contexto)
    else:
        contexto['mensaje'] = formulario.errors
        contexto['categorias'] = Categoria.objects.all()
        return render(request, 'sitio/Web_categorias.html', contexto)

@require_POST
@login_required
def editar_categoria(request, pk):
    contexto = {}
    try:
        categoria = Categoria.objects.get(id=pk)
    except Categoria.DoesNotExist:
        contexto['categorias'] = Categoria.objects.all()
        contexto['mensaje'] = 'El registro que está intentando actualizar no fue encontrado'
        return render(request, 'sitio/web_categorias.html', contexto)
    formulario = CategoriaForm(request.POST, request.FILES, instance=categoria)
    if formulario.is_valid():
        formulario.save()
        contexto['categorias'] = Categoria.objects.all()
        contexto['mensaje'] = 'El registro de la Categoría se ha actualizado con éxito'
        return render(request, 'sitio/web_categorias.html', contexto)
    else:
        contexto['categorias'] = Categoria.objects.all()
        contexto['mensaje'] = formulario.errors
        return render(request, 'sitio/web_categorias.html', contexto)

@require_GET
@login_required
def eliminar_categoria(request, pk):
    contexto = {}
    try:
        categoria = Categoria.objects.get(id=pk).delete()
    except Categoria.DoesNotExist:
        contexto['mensaje'] = 'El registro no pudo ser borrado o no existe'
        contexto['categorias'] = Categoria.objects.all()
        return render(request, 'sitio/web_categorias.html', contexto)
    contexto['mensaje'] = 'Registro de Categoría borrado con éxito'
    contexto['categorias'] = Categoria.objects.all()
    return render(request, 'sitio/web_categorias.html', contexto)


@require_GET
@login_required
def productos_barra(request):
    contexto = {}
    contexto['categorias_barra'] = CategoriaBarra.objects.all()
    contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
    contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
    contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
    return render(request, 'sitio/productos_barra.html', contexto)

@require_POST
@login_required
def filtro_productos_barra(request):
    contexto = {}
    productos_barra = ProductoBarra.objects.order_by('categoria')
    if request.POST['categoria']:
        productos_barra = productos_barra.filter(categoria=request.POST['categoria'])
    else:
        return HttpResponseRedirect(reverse('sitio:productos_barra'))
    contexto['categorias_barra'] = CategoriaBarra.objects.all()
    contexto['totales'] = totales_productos_barra(productos_barra)
    contexto['productos_barra'] = productos_barra
    contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
    return render(request, 'sitio/productos_barra.html', contexto)

@require_POST
@login_required
def guardar_producto_barra(request):
    contexto = {}
    formulario = ProductoBarraForm(request.POST)
    if formulario.is_valid():
        formulario.save()
        contexto['mensaje'] = 'Registro guardado con éxito'
        contexto['categorias_barra'] = CategoriaBarra.objects.all()
        contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
        contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
        contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
        return render(request, 'sitio/productos_barra.html', contexto)
    else:
        contexto['mensaje'] = formulario.errors
        contexto['categorias_barra'] = CategoriaBarra.objects.all()
        contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
        contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
        contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
        return render(request, 'sitio/productos_barra.html', contexto)

@require_POST
@login_required
def editar_producto_barra(request, pk):
    contexto = {}
    try:
        producto_barra = ProductoBarra.objects.get(id=pk)
    except ProductoBarra.DoesNotExist:
        contexto['mensaje'] = 'El registro no pudo ser actualizado o no existe'
        contexto['categorias_barra'] = CategoriaBarra.objects.all()
        contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
        contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
        contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
        return render(request, 'sitio/productos_barra.html', contexto)
    formulario = ProductoBarraForm(request.POST, instance=producto_barra)
    if formulario.is_valid():
        formulario.save()
        contexto['mensaje'] = 'El registro fue actualizado con éxito'
        contexto['categorias_barra'] = CategoriaBarra.objects.all()
        contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
        contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
        contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
        return render(request, 'sitio/productos_barra.html', contexto)
    else:
        contexto['mensaje'] = formulario.errors
        contexto['categorias_barra'] = CategoriaBarra.objects.all()
        contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
        contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
        contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
        return render(request, 'sitio/productos_barra.html', contexto)

@require_GET
@login_required
def eliminar_producto_barra(request, pk):
    contexto = {}
    try:
        ProductoBarra.objects.get(id=pk).delete()
        contexto['mensaje'] = 'El registro fue borrado con éxito'
    except ProductoBarra.DoesNotExist:
        contexto['mensaje'] = 'El registro no pudo ser borrado o no existe'
        contexto['categorias_barra'] = CategoriaBarra.objects.all()
        contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
        contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
        contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
        return render(request, 'sitio/productos_barra.html', contexto)
    contexto['categorias_barra'] = CategoriaBarra.objects.all()
    contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
    contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
    contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
    return render(request, 'sitio/productos_barra.html', contexto)

@require_POST
@login_required
def guardar_categoria_barra(request):
    contexto = {}
    formulario = CategoriaBarraForm(request.POST)
    if formulario.is_valid():
        formulario.save()
        contexto['mensaje'] = 'Su registro ha sido guardado con éxito'
        contexto['categorias_barra'] = CategoriaBarra.objects.all()
        contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
        contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
        contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
        return render(request, 'sitio/productos_barra.html', contexto)
    else:
        contexto['mensaje'] = formulario.errors
        contexto['categorias_barra'] = CategoriaBarra.objects.all()
        contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
        contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
        contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
        return render(request, 'sitio/productos_barra.html', contexto)

@require_GET
@login_required
def eliminar_categoria_barra(request, pk):
    contexto = {}
    try:
        CategoriaBarra.objects.get(pk=pk).delete()
        contexto['mensaje'] = 'El registro fue borrado con éxito'
    except CategoriaBarra.DoesNotExist:
        contexto['mensaje'] = 'El registro no pudo ser borrado o no existe'
        contexto['categorias_barra'] = CategoriaBarra.objects.all()
        contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
        contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
        contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
        return render(request, 'sitio/productos_barra.html', contexto)
    contexto['categorias_barra'] = CategoriaBarra.objects.all()
    contexto['productos_barra'] = ProductoBarra.objects.order_by('categoria')
    contexto['totales'] = totales_productos_barra(contexto['productos_barra'])
    contexto['costo_estructural'] = COSTO_ESTRUCTURAL_BARRA
    return render(request, 'sitio/productos_barra.html', contexto)

def totales_productos_barra(productos):
    beneficio_unitario = 0
    stock = 0
    costo_total = 0
    costo_estructural = 0
    beneficio_esperado = 0
    for i in productos:
        beneficio_unitario += i.beneficio_unitario
        stock += i.stock
        costo_total +=  i.costo_total
        costo_estructural += i.costo_estructural_esperado
        beneficio_esperado +=  i.beneficio_esperado
    totales = {
        'beneficio_unitario': beneficio_unitario,
        'stock': stock,
        'costo_total': costo_total,
        'costo_estructural': costo_estructural,
        'beneficio_esperado': beneficio_esperado
    }
    return totales


@require_GET
def politicas(request):
    contexto = {}
    return render(request, 'publico/politicas.html')




@require_GET
def cover(request):
    contexto = {}
    contexto['productos'] = {}
    destacados = Producto.objects.exclude(fecha__lte=HORA_OCULTO)
    destacados = destacados.order_by('?')[:3]
    contexto['destacados'] = destacados
    contexto['categorias'] = Categoria.objects.all()
    covers = Cover.objects.all()
    try:
        contexto['cover'] = covers[0]
    except IndexError:
        contexto['no_cover'] = True
    return render(request, 'publico/cover.html', contexto)


    

@require_GET
@login_required
def web_cover(request):
    contexto = {}
    covers = Cover.objects.all()
    try:
        contexto['cover'] = covers[0]
    except IndexError:
        contexto['no_cover'] = True
        return render(request, 'sitio/web_cover.html', contexto)
    return render(request, 'sitio/web_cover.html', contexto)

@require_POST
@login_required
def guardar_cover(request):
    contexto = {}
    formulario = CoverForm(request.POST, request.FILES)
    if formulario.is_valid():
        cover = formulario.save()
        contexto['mensaje'] = 'Información del Cover guardada con éxito'
        contexto['cover'] = cover
        return render(request, 'sitio/web_cover.html', contexto)
    else:
        contexto['cover'] = None
        contexto['mensaje'] = formulario.errors
        return render(request, 'sitio/web_cover.html', contexto)

@require_POST
@login_required
def editar_cover(request, pk):
    contexto = {}
    cover = Cover.objects.get(id=pk)
    formulario = CoverForm(request.POST, request.FILES, instance=cover)
    if formulario.is_valid():
        cover = formulario.save()
        contexto['cover'] = cover
        contexto['mensaje'] = 'El registro del Cover se ha actualizado con éxito'
        return render(request, 'sitio/web_cover.html', contexto)
    else:
        contexto['cover'] = None
        contexto['mensaje'] = formulario.errors
        return render(request, 'sitio/web_cover.html', contexto)


@require_GET
@login_required
def control_ingreso(request):
    contexto = {}
    contexto['transacciones'] = Transaccion.objects.filter(estado=True).order_by('-fecha')[:100]
    contexto['totales'] = totales_transacciones(contexto['transacciones'])
    return render(request, 'sitio/control_ingreso.html', contexto)

def totales_transacciones(transacciones):
    contador = 0
    valor = 0
    costo = 0
    costo_estructural = settings.COSTO_ESTRUCTURAL
    beneficio = 0
    descuento = 0
    valor_factura = 0
    for i in transacciones:
        valor += i.valor 
        costo += i.costo
        costo_estructural += i.costo_estructural
        beneficio += i.beneficio
        descuento += i.descuento
        valor_factura +=i.valor_factura
        contador += 1
    totales = {
        'valor': valor ,
        'costo': costo,
        'costo_estructural': costo_estructural,
        'beneficio': beneficio,
        'descuento': descuento,
        'valor_factura': valor_factura
    }
    return totales

@require_POST
@login_required
def filtro_facturas(request):
    contexto = {}
    transacciones = Transaccion.objects.filter(estado=True).order_by('-fecha')
    if request.POST['fecha_desde']:
        transacciones = transacciones.filter(fecha__gte=request.POST['fecha_desde'])
    if request.POST['fecha_hasta']:
        transacciones = transacciones.filter(fecha__lte=request.POST['fecha_hasta'])
    if request.POST['tipo']:
        transacciones = transacciones.filter(tipo=request.POST['tipo'])
    if request.POST['medio_pago']:
        transacciones = transacciones.filter(medio_pago=request.POST['medio_pago'])
    contexto['transacciones'] = transacciones
    contexto['totales'] = totales_transacciones(transacciones)
    return render(request, 'sitio/control_ingreso.html', contexto)

@require_GET
@login_required
def resumen_factura(request, pk):
    contexto = {}
    transaccion = Transaccion.objects.get(id=pk)
    transaccion_productos = TransaccionProducto.objects.filter(id_transaccion=pk)
    contexto['transaccion_productos'] = transaccion_productos
    contexto['transaccion'] = transaccion
    return render(request, 'sitio/resumen_factura.html', contexto)

@require_POST
@login_required
def reportar_factura(request, pk):
    contexto = {}
    transaccion = Transaccion.objects.get(id=pk)
    reporte = TransaccionReporte.objects.create(transaccion=transaccion, nota=request.POST['nota'])
    reporte.save()
    transaccion.estado = False
    transaccion.save()
    contexto['mensaje'] = 'Su información fue enviada con éxito'
    return render(request, 'sitio/resumen_factura.html', contexto)


@require_GET
def comprar(request):
    contexto = {}
    return render(request, 'publico/comprar.html')


@require_GET
def productos_vista(request, id_producto):
    producto_seleccionado = get_object_or_404(Producto, id=id_producto)
    contexto = {'producto_seleccionado': producto_seleccionado}
    contexto['productos'] = {}
    contexto['categorias'] = Categoria.objects.all()
    covers = Cover.objects.all()
    try:
        contexto['cover'] = covers[0]
    except IndexError:
        contexto['no_cover'] = True
    return render(request, 'publico/productos_vista.html', contexto)

@require_GET
def simuladorcredito(request):
    contexto = {}
    return render(request, 'publico/simuladorcredito.html')

@require_GET
def mincostos(request):
    contexto = {}
    return render(request, 'publico/mincostos.html')

@require_GET
def maxbeneficio(request):
    contexto = {}
    return render(request, 'publico/maxbeneficio.html')

@require_GET
def estadisticas(request):
    contexto = {}
    return render(request, 'publico/estadisticas.html')

@require_GET
def rentabilidadm1(request):
    contexto = {}
    return render(request, 'publico/rentabilidadm1.html')

@require_GET
def rentabilidadm2(request):
    contexto = {}
    return render(request, 'publico/rentabilidadm2.html')

@require_GET
def documentos(request):
    contexto = {}
    contexto['productos'] = {}
    contexto['listas'] = Lista.objects.all()
    destacados = Producto.objects.exclude(fecha__lte=HORA_OCULTO)
    destacados = destacados.order_by('?')[:3]
    contexto['destacados'] = destacados
    contexto['categorias'] = Categoria.objects.all()
    covers = Cover.objects.all()
    try:
        contexto['cover'] = covers[0]
    except IndexError:
        contexto['no_cover'] = True
    return render(request, 'publico/documentos.html', contexto)


@require_GET
@login_required
def web_contenido(request):
    contexto = {}
    contexto['listas'] = Lista.objects.all()
    return render(request, 'sitio/web_contenido.html', contexto)



@require_GET
@login_required
def web_lista(request):
    contexto = {}
    contexto['listas'] = Lista.objects.all()
    return render(request, 'sitio/web_conteido.html', contexto)

@require_POST
@login_required
def guardar_lista(request):
    contexto = {}
    formulario = ListaForm(request.POST, request.FILES)
    if formulario.is_valid():
        formulario.save()
        contexto['mensaje'] = 'La Información de la lista fue guardada con éxito'
        contexto['listas'] = Lista.objects.all()
        return render(request, 'sitio/web_contenido.html', contexto)
    else:
        contexto['mensaje'] = formulario.errors
        contexto['listas'] = Lista.objects.all()
        return render(request, 'sitio/web_contenido.html', contexto)



@require_GET
@login_required
def eliminar_lista(request, pk):
    contexto = {}
    try:
        lista = Lista.objects.get(id=pk).delete()
    except Lista.DoesNotExist:
        contexto['mensaje'] = 'El registro no pudo ser borrado o no existe'
        contexto['listas'] = Lista.objects.all()
        return render(request, 'sitio/web_contenido.html', contexto)
    contexto['mensaje'] = 'Registro de la lista se ha borrado con éxito'
    contexto['listas'] = Lista.objects.all()
    return render(request, 'sitio/web_contenido.html', contexto)