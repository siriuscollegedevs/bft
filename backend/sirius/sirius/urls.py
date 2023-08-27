from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('auth/', include('authorization_app.urls')),
    path('', include('sirius_access.urls')),
    path('request/', include('request_app.urls')),
    # SWAGGER
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
    path('admin/', admin.site.urls),
]
