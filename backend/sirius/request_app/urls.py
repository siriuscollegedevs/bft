from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostRequest.as_view()),
    path('/<uuid:RequestId>', views.RequestApiView.as_view()),
    path('/change_status/<uuid:RequestId>', views.ChangeStatusRequest.as_view()),
    path('/record/human/<uuid:RequestId>', views.HumanRecord.as_view()),
]