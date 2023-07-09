from django.urls import path
from . import views
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('objects/archive', views.GetArchiveObjects.as_view()),
    path('objects', views.GetActualObjects.as_view()),
    path('object', views.PostObject.as_view()),
    path('object/<uuid:ObjectId>', views.ObjectApiView.as_view()),
    path('object/history/<uuid:ObjectId>', views.ObjectHistoryApiView.as_view()),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs')
]