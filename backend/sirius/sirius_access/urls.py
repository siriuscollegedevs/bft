from django.urls import path
from . import views

urlpatterns = [
    path('objects/archive', views.GetArchiveObjects.as_view()),
    path('objects', views.GetActualObjects.as_view()),
    path('object', views.ObjectApiView.as_view()),
    path('object/<uuid:ObjectId>', views.ObjectApiView.as_view()),
    path('object/history/<uuid:ObjectId>', views.ObjectHistoryApiView.as_view())
]