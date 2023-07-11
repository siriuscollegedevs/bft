from django.urls import path
from . import views
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # OBJECTS
    path('objects/archive', views.GetArchiveObjects.as_view()),
    path('objects', views.GetActualObjects.as_view()),
    path('object', views.PostObject.as_view()),
    path('object/<uuid:ObjectId>', views.ObjectApiView.as_view()),
    path('object/history/<uuid:ObjectId>', views.ObjectHistoryApiView.as_view()),
    # ACCOUNTS
    path('accounts', views.GetActualAccounts.as_view()),
    path('accounts/archive', views.GetArchiveAccounts.as_view()),
    path('account', views.PostAccount.as_view()),
    path('account/<uuid:AccountId>', views.GetPutDeleteAccount.as_view()),
    path('account/change_pswd/<uuid:AccountId>', views.ChangePasswordApi.as_view()),
    path('account/history/<uuid:AccountId>', views.AccountHistoryApiView.as_view()),
    # SWAGGER
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs')
]
