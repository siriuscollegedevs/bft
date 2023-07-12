from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostRequest.as_view()),
    path('/<uuid:RequestId>', views.RequestApiView.as_view()),
]