from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from sitio import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('juanjoseberriogaleano/', include('sitio.urls')),
    path('', RedirectView.as_view(url='/juanjoseberriogaleano/', permanent=True)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
