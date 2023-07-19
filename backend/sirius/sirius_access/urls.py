from django.urls import path
from . import views

urlpatterns = [
    # OBJECTS
    path('objects/archive/', views.GetArchiveObjects.as_view()),
    path('objects/', views.GetActualObjects.as_view()),
    path('object/', views.PostObject.as_view()),
    path('object/<uuid:ObjectId>/', views.ObjectApiView.as_view()),
    path('object/history/<uuid:ObjectId>/', views.ObjectHistoryApiView.as_view()),
    # ACCOUNTS
    path('accounts', views.GetActualAccounts.as_view()),
    path('accounts/archive', views.GetArchiveAccounts.as_view()),
    path('account', views.PostAccount.as_view()),
    path('account/<uuid:AccountId>', views.GetPutDeleteAccount.as_view()),
    path('account/change_pswd/<uuid:AccountId>', views.ChangePasswordApi.as_view()),
    path('account/history/<uuid:AccountId>', views.AccountHistoryApiView.as_view()),
    path('account/expand_search', views.AccountExpandSearch.as_view()),
    # ACCOUNT TO OBJECTS
    path('object/accounts', views.GetAccountsObjectsView.as_view()),
    path('account_to_objects', views.GetAccountByObjectView.as_view()),
]
