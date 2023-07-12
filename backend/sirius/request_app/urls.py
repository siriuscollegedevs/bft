from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostRequest.as_view())
]