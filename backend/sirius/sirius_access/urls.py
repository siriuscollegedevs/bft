from django.urls import path, re_path
from . import views

urlpatterns = [
    # OBJECTS
    path('objects/all/archive', views.GetArchiveObjects.as_view()),
    path('objects/all', views.GetActualObjects.as_view()),
    path('object', views.PostObject.as_view()),
    path('object/<uuid:ObjectId>', views.ObjectApiView.as_view()),
    path('object/history/<uuid:ObjectId>', views.ObjectHistoryApiView.as_view()),
    # ACCOUNTS
    path('accounts/all', views.GetActualAccounts.as_view()),
    path('accounts/all/archive', views.GetArchiveAccounts.as_view()),
    path('account', views.PostAccount.as_view()),
    path('account/<uuid:AccountId>', views.GetPutDeleteAccount.as_view()),
    path('account/change_pswd/<uuid:AccountId>', views.ChangePasswordApi.as_view()),
    path('account/history/<uuid:AccountId>', views.AccountHistoryApiView.as_view()),
    path('account/expand_search', views.ActualAccountExpandSearch.as_view()),
    path('account/expand_search/archive', views.ArchiveAccountExpandSearch.as_view()),
    # ACCOUNT TO OBJECTS
    path('account_to_objects', views.GetActualAccountsObjectsView.as_view()),
    path('account_to_objects/archive', views.GetArchiveAccountsObjectsView.as_view()),
    path('object/accounts', views.GetActualAccountByObjectView.as_view()),
    path('object/accounts/archive', views.GetArchiveAccountByObjectView.as_view()),
    path('account_to_objects/<uuid:AccountId>', views.AccountToObjectView.as_view()),
    path('account_to_object/expand_search', views.ActualAccountToObjectExpandSearchView.as_view()),
    path('account_to_object/expand_search/archive', views.ArchiveAccountToObjectExpandSearchView.as_view()),
]

PATHS = (
    r'^$',
    'settings',
    'navigation',
    'directories',
    'accounts',
    'accounts/archive',
    'accounts/create',
    'accounts/:id',
    'accounts/search',
    'accounts/history/:id',
    'objects',
    'objects/archive',
    'objects/create',
    'objects/:id',
    'objects/search',
    'objects/history/:id',
    'employees',
    'employees/archive',
    'employees/create',
    'employees/:id',
    'employees/search',
    'employees/history/:id',
    'admissions',
    'admissions/archive',
    'admissions/view/{:admission_id}',
    'admissions/{:admission_id}',
    'admissions/create',
    'admissions/search',
    'admissions/{:admission_id}/record/create',
    'admissions/{:admission_id}/record/edit',
    'admissions/history/{:admission_id}',
)
    
urlpatterns += [re_path(path, views.indexView) for path in PATHS]
