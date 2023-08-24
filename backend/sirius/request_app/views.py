from rest_framework.response import Response
from .models import Request, RequestHistory, Record, RecordHistory, RequestToObject
from sirius_access.models import Object, Account
from sirius_access.config import NO_SEARCH_OBJECTS_FOUND_ERROR
from rest_framework import status
from django.db import transaction
from rest_framework.views import APIView
from . import serializers
from sirius.general_functions import get_user, list_to_queryset, get_max_code
from .config import *
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers as ser
from sirius.config import DB_ERROR
from sirius_access.config import OBJECTID_ERROR_MSG
import openpyxl
from rest_framework.decorators import api_view


def get_request(RequestId):
    try:
        return Request.objects.get(id=RequestId)
    except Exception:
        return None


def get_record(RecordId):
    try:
        return Record.objects.get(id=RecordId)
    except Exception:
        return None


class GetRequests(APIView):
    status: str

    @extend_schema(
        responses={
            status.HTTP_200_OK: serializers.RequestSerializer(many=True),
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        },
        request=inline_serializer(
            name='get_requests',
            fields={
                'ids': ser.ListField(child=ser.UUIDField())
            }
        )
    )
    def post(self, request):
        objects_ids = request.data.get('ids', None)
        if objects_ids is None:
            res = [req.get_info() for req in Request.objects.filter(status=self.status)]
            return Response(serializers.RequestSerializer(res, many=True).data)
        res = []
        request_ids = set()
        for object_id in objects_ids:
            try:
                object = Object.objects.get(id=object_id)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=OBJECTID_ERROR_MSG)
            for line in RequestToObject.objects.filter(object=object):
                if line.request.id in request_ids:
                    continue
                request_ids.add(line.request.id)
                if line.request.status == self.status:
                    res.append(line.request.get_info())
        return Response(serializers.RequestSerializer(res, many=True).data)


class GetActiveRequests(GetRequests):
    status = 'active'


class GetArchiveRequests(GetRequests):
    status = 'outdated'


class PostRequest(APIView):

    @extend_schema(
        responses={
            status.HTTP_200_OK: serializers.PostRequestSerializer(),
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        },
        request=inline_serializer(
            name='post_request_req',
            fields={
                'object_ids': ser.ListField(child=ser.UUIDField())
            }
        )
    )
    def post(self, request):
        object_ids = request.data.get('object_ids', [])
        if not object_ids:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_OBJECTS_GIVEN_ERROR)
        try:
            with transaction.atomic():
                req = Request.objects.create(status='active')
                for object_id in object_ids:
                    try:
                        object = Object.objects.get(id=object_id)
                    except Exception:
                        return Response(status=status.HTTP_400_BAD_REQUEST, data=OBJECTID_ERROR_MSG)
                    RequestToObject.objects.create(
                        object=object,
                        request=req
                    )
                    try:
                        req_code = get_max_code() + 1
                    except Exception:
                        return Response(status=status.HTTP_400_BAD_REQUEST)  # NOTE не удалось получить код
                req_history = RequestHistory.objects.create(
                    request=req,
                    code=req_code,
                    action='created',
                    modified_by=get_user(request)
                )
                return Response(
                    serializers.PostRequestSerializer(
                        {
                            'id': req.id,
                            'code': req_code,
                            'timestamp': req_history.timestamp.date()
                        }
                    ).data)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RequestApiView(APIView):

    @extend_schema(
        responses={
            status.HTTP_200_OK: serializers.RecordSerializer(
                many=True,
                fields=REQUEST_GET_FIELDS
            ),
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        }
    )
    def get(self, _, RequestId):
        res = []
        req = get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=REQUESTID_ERROR_MSG)
        res = [record.get_info() for record in Record.objects.filter(request=req, status='active')]
        return Response(serializers.RecordSerializer(res, many=True, fields=REQUEST_GET_FIELDS).data)

    @extend_schema(
        responses={
            status.HTTP_204_NO_CONTENT: None,
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        }
    )
    def delete(self, request, RequestId):
        req = get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=REQUESTID_ERROR_MSG)
        try:
            with transaction.atomic():
                req.make_outdated(user=get_user(request), action='deleted')
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChangeStatusRequest(APIView):

    @extend_schema(
        responses={
            status.HTTP_200_OK: None,
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        },
        request=serializers.ChangeStatusSerializer,
        description="status in ['closed', 'canceled']. Поле reason обязательно при status = canceled"
    )
    def put(self, request, RequestId):
        req = get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=REQUESTID_ERROR_MSG)
        serializer = serializers.ChangeStatusSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                with transaction.atomic():
                    # тут гет там просто так бер1те из словаря
                    req.make_outdated(user=get_user(request), action=data['status'], note=data.get('reason', None))
                    return Response(status=status.HTTP_200_OK)
            except Exception:
                Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class PostRecord(APIView):
    record_type: str

    def post(self, request, RequestId):
        serializer = serializers.RecordSerializer(data=request.data, record_type=self.record_type)
        if serializer.is_valid():
            req = get_request(RequestId)
            # if is None
            if not req:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
            try:
                with transaction.atomic():
                    record = Record.objects.create(status='active', request=req)
                    RecordHistory.objects.create(action='created', modified_by=get_user(
                        request), record=record, **serializer.validated_data)
                    return Response(status=status.HTTP_201_CREATED, data={'id': record.id})
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class HumanRecord(PostRecord):
    record_type = 'human'


class CarRecord(PostRecord):
    record_type = 'car'


class DeletePutGetRecord(APIView):

    def get(self, _, RecordId):
        record = get_record(RecordId)
        if not record:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
        return Response(serializers.RecordSerializer(record.get_info()).data)

    @extend_schema(
        responses={
            status.HTTP_204_NO_CONTENT: None,
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        }
    )
    def delete(self, request, RecordId):
        record = get_record(RecordId)
        if not record:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
        try:
            with transaction.atomic():
                record.make_outdated(user=get_user(request), action='deleted')
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        responses={
            status.HTTP_200_OK: None,
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        },
        request=inline_serializer(
            name='record_put',
            fields={
                'type': ser.CharField(),
                'first_name': ser.CharField(),
                'surname': ser.CharField(),
                'last_name': ser.CharField(),
                'object_id': ser.UUIDField(),
                'car_number': ser.CharField(),
                'car_brand': ser.CharField(),
                'car_model': ser.CharField(),
                'from_date': ser.DateTimeField(),
                'to_date': ser.DateTimeField(),
                'note': ser.CharField()
            }
        ),
        description="Any of the fields can be null"
    )
    def put(self, request, RecordId):
        record = get_record(RecordId)
        if not record:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
        serializer = serializers.RecordSerializer(data=request.data)
        if serializer.is_valid():
            RecordHistory.objects.create(modified_by=get_user(request), action='modified',
                                         record=record, **serializer.validated_data)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class ChangeStatusRecord(APIView):

    @extend_schema(
        responses={
            status.HTTP_200_OK: None,
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        },
        request=serializers.ChangeStatusSerializer,
        description="status in ['closed', 'canceled']. Поле reason обязательно при status = canceled"
    )
    def put(self, request, RecordId):
        record = get_record(RecordId)
        if not record:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
        serializer = serializers.ChangeStatusSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                with transaction.atomic():
                    record.make_outdated(user=get_user(request), action=data['status'], note=data.get('reason', ''))
                    return Response(status=status.HTTP_200_OK)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class RecordHistoryView(APIView):
    @extend_schema(
        responses={
            status.HTTP_200_OK: inline_serializer(
                name='record_history',
                fields={
                    'type': ser.CharField(),
                    'first_name': ser.CharField(),
                    'surname': ser.CharField(),
                    'last_name': ser.CharField(),
                    'object': ser.CharField(),
                    'car_number': ser.CharField(),
                    'car_brand': ser.CharField(),
                    'car_model': ser.CharField(),
                    'from_date': ser.DateTimeField(),
                    'to_date': ser.DateTimeField(),
                    'note': ser.CharField(),
                    'action': ser.CharField(),
                    'timestamp': ser.DateTimeField(),
                    "modified_by": ser.CharField()
                }
            ),
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        }
    )
    def get(self, _, RecordId):
        record = get_record(RecordId)
        if not record:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
        res = [rh.get_info() for rh in RecordHistory.objects.filter(record=record)]
        return Response(serializers.RecordSerializer(res, many=True, fields=GET_RECORD_HISTORY_FIELDS).data)


class RecordArchive(APIView):
    @extend_schema(
        responses={
            status.HTTP_200_OK: serializers.RecordSerializer(many=True, fields=REQUEST_GET_FIELDS),
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        }
    )
    def get(self, _, RequestId):
        req = get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=REQUESTID_ERROR_MSG)
        res = [record.get_info() for record in Record.objects.filter(request=req, status='outdated')]
        return Response(serializers.RecordSerializer(res, many=True, fields=REQUEST_GET_FIELDS).data)


class RequestExpandSearch(APIView):
    status: str

    @extend_schema(
        responses={
            status.HTTP_200_OK: serializers.RequestSearchSerializer(many=True),
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED: None
        },
        request=inline_serializer(
            name='request_expand_search',
            fields={
                'car_number': ser.CharField(),
                'car_brand': ser.CharField(),
                'car_model': ser.CharField(),
                'objects': ser.ListField(child=ser.UUIDField()),
                'type': ser.CharField(),
                'first_name': ser.CharField(),
                'last_name': ser.CharField(),
                'surname': ser.CharField(),
                'from_date': ser.DateField(),
                'to_date': ser.DateField(),
                'note': ser.CharField()
            }
        )
    )
    def post(self, request):
        search_records = dict()
        object_ids = request.data.pop('objects', [])
        record_type = ''
        for key, item in request.data.items():
            if not record_type:
                if key in HUMAN_RECORD_KEYS and item and isinstance(item, str):
                    item = item.capitalize()
                    record_type = 'human'
                    search_records[key] = item
                elif key in CAR_RECORD_KEYS and item and isinstance(item, str):
                    item = item.upper()
                    record_type = 'car'
                    search_records[key] = item
                elif key in GENERAL_RECORD_KEYS and item:
                    search_records[key] = item
            elif record_type == 'human' and key in HUMAN_RECORD_KEYS and item:
                search_records[key] = item
            elif record_type == 'car' and key in CAR_RECORD_KEYS and item:
                search_records[key] = item
        try:
            objects = [Object.objects.get(id=object_id) for object_id in object_ids]
        except Exception:
            # NOTE объекты по запросу не найдены
            return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_SEARCH_OBJECTS_FOUND_ERROR)
        try:
            with transaction.atomic():
                all_records = Record.objects.filter(status=self.status)
                if not all_records:
                    # NOTE записи не найдены
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_RECORDS_FOUND_ERROR)
                records = [record.get_last_version() for record in all_records]
                records_history = list_to_queryset(RecordHistory, records).filter(**search_records)
                if not records_history:
                    # NOTE записи по запросу не найдены
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_SEARCH_RECORDS_FOUND_ERROR)
                records = [record_history.record for record_history in records_history]
                if objects:
                    records = [
                        record for record in records if all(
                            map(
                                lambda object_ins: RequestToObject.objects.filter(
                                    request=record.request, object=object_ins).exists(),
                                objects
                            )
                        )
                    ]
                res = []
                for record in records:
                    record_info = record.get_info()
                    record_info['code'] = record.request.get_last_version().code
                    record_info['request_id'] = record.request.id
                    record_info['objects'] = list(
                        map(
                            lambda request_to_object: request_to_object.object.get_info().name,
                            RequestToObject.objects.filter(request=record.request)
                        )
                    )
                    res.append(record_info)
                print(len(res))
                if not res:
                    # NOTE записи по запросу не найдены
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_SEARCH_RECORDS_FOUND_ERROR)
                return Response(serializers.RequestSearchSerializer(res, many=True).data)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR)  # NOTE ошибка транзакции


class ActualRequestExpandSearch(RequestExpandSearch):
    status = 'active'


class ArchiveRequestExpandSearch(RequestExpandSearch):
    status = 'outdated'


class DeleteRecords(APIView):

    def delete(self, request):
        record_ids = request.data.get('ids', None)
        if record_ids is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
        try:
            with transaction.atomic():
                for record_id in record_ids:
                    record = get_record(record_id)
                    if not record:
                        return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
                    record.make_outdated(user=get_user(request), action='deleted')

                return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RequestInfo(APIView):

    def get(self, _, RequestId):
        req = get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=REQUESTID_ERROR_MSG)
        return Response(serializers.RequestSerializer(req.get_info()).data)


@api_view(('POST',))
def excel(request):
    wb = openpyxl.load_workbook(request.FILES["excel_file"])
    worksheet = wb["Заявка"]
    try:
        req = Request.objects.get(id=request.POST['request_id'])
    except Exception:
        return Response(status=status.HTTP_400_BAD_REQUEST, data=REQUESTID_ERROR_MSG)
    start = START
    dates = {"to_date" : worksheet[TO_DATE_CELL].value.date(), "from_date" : worksheet[FROM_DATE_CELL].value.date()}
    type = "for_once" if dates["to_date"] == dates["from_date"] else "for_long_time"

    try:
        with transaction.atomic():
            while True:
                if worksheet['B' + start].value == 'Список автотранспортных средств':
                    start = str(int(start) + 2)
                    break
                if not worksheet['B' + start].value:
                    start = str(int(start) + 1)
                    continue
                record = Record.objects.create(status='active', request=req)
                data = {"last_name": worksheet[LAST_NAME_FIELD_LETTER + start].value,
                        "first_name": worksheet[FIRST_NAME_FIELD_LETTER + start].value,
                        "surname": worksheet[SURNAME_FIELD_LETTER + start].value
                        }
                RecordHistory.objects.create(action='created', modified_by=get_user(
                    request), record=record, type=type, **data, **dates)
                start = str(int(start) + 1)
            while True:
                if not worksheet['B' + start].value:
                    return Response(status=status.HTTP_200_OK)
                record = Record.objects.create(status='active', request=req)
                data = {"car_brand": worksheet[CAR_BRAND_FIELD_LETTER + start].value,
                        "note": worksheet[CAR_NOTE_FIELD_LETTER + start].value,
                        "car_number": worksheet[CAR_NUMBER_FIELD_LETTER + start].value}
                RecordHistory.objects.create(action='created', modified_by=get_user(
                    request), record=record, type=type, **data, **dates)
                start = str(int(start) + 1)
    except Exception:
        return Response(status=status.HTTP_400_BAD_REQUEST)
