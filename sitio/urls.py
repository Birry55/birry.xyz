from django.urls import path
from . import views

app_name = 'sitio'

urlpatterns = [
    path('autenticacion/', views.autenticacion, name='autenticacion'),
    path('autenticar/', views.autenticar, name='autenticar'),
    path('cerrar_sesion/', views.cerrar_sesion, name='cerrar_sesion'),
    path('inicio/', views.inicio, name='inicio'),
    path('contactos/', views.contactos, name='contactos'),
    path('solicitar_contacto/<int:pk>/', views.solicitar_contacto, name='solicitar_contacto'),
    path('guardar_contacto/', views.guardar_contacto, name='guardar_contacto'),
    path('marcar_enviado/<int:pk>/', views.marcar_enviado, name='marcar_enviado'),
    path('productos/', views.web_productos, name='productos'),
    path('productos_vista/<int:id_producto>/', views.productos_vista, name='productos_vista'),
    path('filtro_categoria/', views.filtro_categoria, name='filtro_categoria'),
    path('guardar_producto/', views.guardar_producto, name='guardar_producto'),
    path('editar_producto/<int:pk>/', views.editar_producto, name='editar_producto'),
    path('eliminar_producto/<int:pk>/', views.eliminar_producto, name='eliminar_producto'),
    path('categoria/<int:pk>/', views.categoria, name='categoria'),
    path('categorias/', views.web_categorias, name='categorias'),
    path('guardar_categoria/', views.guardar_categoria, name='guardar_categoria'),
    path('editar_categoria/<int:pk>/', views.editar_categoria, name='editar_categoria'),
    path('eliminar_categoria/<int:pk>/', views.eliminar_categoria, name='eliminar_categoria'),
    path('', views.cover, name='cover'),
    path('WebCover/', views.web_cover, name='web_cover'),
    path('guardar_cover/', views.guardar_cover, name='guardar_cover'),
    path('editar_cover/<int:pk>/', views.editar_cover, name='editar_cover'),
    path('control_ingreso/', views.control_ingreso, name='control_ingreso'),
    path('filtro_facturas/', views.filtro_facturas, name='filtro_facturas'),
    path('resumen_factura/<int:pk>/', views.resumen_factura, name='resumen_factura'),
    path('reportar_factura/<int:pk>/', views.reportar_factura, name='reportar_factura'),
    path('politicas/', views.politicas, name='politicas'),
    path('comprar/', views.comprar, name='comprar'),
    path('calculadoras/', views.calculadoras, name='calculadoras'),
    path('simuladorcredito/', views.simuladorcredito, name='simuladorcredito'),
    path('mincostos/', views.mincostos, name='mincostos'),
    path('costosproduccion/', views.costosproduccion, name='costosproduccion'),


    path('maxbeneficio/', views.maxbeneficio, name='maxbeneficio'),
    path('estadisticas/', views.estadisticas, name='estadisticas'),
    path('rentabilidadm1/', views.rentabilidadm1, name='rentabilidadm1'),
    path('rentabilidadm2/', views.rentabilidadm2, name='rentabilidadm2'),
    path('documentos', views.documentos, name='documentos'),
    path('web_contenido/', views.web_contenido, name='web_contenido'),
    path('guardar_lista/', views.guardar_lista, name='guardar_lista'),
    path('eliminar_lista/<int:pk>/', views.eliminar_lista, name='eliminar_lista'),

]
