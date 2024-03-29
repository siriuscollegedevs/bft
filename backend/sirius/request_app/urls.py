from django.urls import path
from . import views

urlpatterns = [
    path('create', views.PostRequest.as_view()),
    path('<uuid:RequestId>', views.RequestApiView.as_view()),
    path('requests', views.GetActiveRequests.as_view()),
    path('archive', views.GetArchiveRequests.as_view()),
    path('change_status/<uuid:RequestId>', views.ChangeStatusRequest.as_view()),
    path('record/human/<uuid:RequestId>', views.HumanRecord.as_view()),
    path('record/car/<uuid:RequestId>', views.CarRecord.as_view()),
    path('record/<uuid:RecordId>', views.DeletePutGetRecord.as_view()),
    path('record/change_status/<uuid:RecordId>', views.ChangeStatusRecord.as_view()),
    path('record/history/<uuid:RecordId>', views.RecordHistoryView.as_view()),
    path('records/archive/<uuid:RequestId>', views.RecordArchive.as_view()),
    path('expand_search', views.ActualRequestExpandSearch.as_view()),
    path('expand_search/archive', views.ArchiveRequestExpandSearch.as_view()),
    path('records', views.DeleteRecords.as_view()),
    path('information/<uuid:RequestId>', views.RequestInfo.as_view()),
    path('excel', views.excel)
]
