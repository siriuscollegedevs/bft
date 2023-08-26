from django.urls import path, re_path
from . import views

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
    path('account/expand_search', views.ActualAccountExpandSearch.as_view()),
    path('account/expand_search/archive', views.ArchiveAccountExpandSearch.as_view()),
    # ACCOUNT TO OBJECTS
    path('account_to_objects', views.GetPostActualAccountsObjectsView.as_view()),
    path('account_to_objects/archive', views.GetArchiveAccountsObjectsView.as_view()),
    path('object/accounts', views.GetActualAccountByObjectView.as_view()),
    path('object/accounts/archive', views.GetArchiveAccountByObjectView.as_view()),
    path('account_to_objects/<uuid:AccountId>', views.GetPutDeleteAccountToObjectView.as_view()),
    path('account_to_object/expand_search', views.ActualAccountToObjectExpandSearchView.as_view()),
    path('account_to_object/expand_search/archive', views.ArchiveAccountToObjectExpandSearchView.as_view()),
    re_path(r'^$', views.indexView),
]
