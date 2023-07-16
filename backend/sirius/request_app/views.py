from rest_framework.response import Response
from .models import Request, RequestHistory, Record, RecordHistory
from sirius_access.models import Object
from rest_framework import status
from django.db import transaction
from rest_framework.views import APIView
from . import serializers
from sirius.general_functions import get_user
from .config import REQUESTID_ERROR_MSG, RECORDID_ERROR_MSG, REQUEST_GET_FIELDS, GET_RECORD_HISTORY_FIELDS
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers as ser


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

class PostRequest(APIView):
    @extend_schema(responses={
            status.HTTP_200_OK : inline_serializer(name='post_request_res', fields={'id' : ser.UUIDField()}),
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED : None
    }, request=inline_serializer(name='post_request_req', fields={'code' : ser.CharField()}))
    def post(self, request):
        serializer = serializers.RequestSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            try:
                with transaction.atomic():
                    request = Request.objects.create(status='active')
                    code = code if code else request.id #NOTE
                    request_info = RequestHistory.objects.create(request=request, code=code, action='created', modified_by=get_user(request))
                    return Response(serializers.RequestSerializer({'id': request.id}).data)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class RequestApiView(APIView):

    @extend_schema(responses={
            status.HTTP_200_OK : serializers.RecordSerializer(many=True, fields=REQUEST_GET_FIELDS),
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED : None
    })
    def get(self, _, RequestId):
        res = []
        req = get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST,  data=REQUESTID_ERROR_MSG)
        res= [record.get_info() for record in Record.objects.filter(request=req, status='active')]
        return Response(serializers.RecordSerializer(res, many=True, fields=REQUEST_GET_FIELDS).data)

    @extend_schema(responses={
        status.HTTP_204_NO_CONTENT : None,
        status.HTTP_400_BAD_REQUEST: None,
        status.HTTP_401_UNAUTHORIZED : None
    })
    def delete(self, request, RequestId):
        req = self.get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST,  data=REQUESTID_ERROR_MSG)
        try:
            with transaction.atomic():
                req.make_outdated(user=get_user(request), action='deleted')
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)
    
class ChangeStatusRequest(APIView):

    @extend_schema(responses={
            status.HTTP_200_OK : None,
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED : None
    }, request=serializers.ChangeStatusSerializer, 
    description="status in ['closed', 'canceled']. Поле reason обязательно при status = canceled")
    def put(self, request, RequestId):
        req = get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=REQUESTID_ERROR_MSG)
        serializer = serializers.ChangeStatusSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                with transaction.atomic():
                    req.make_outdated(user=get_user(request), action=data['status'], note=data.get('reason', None))
                    return Response(status=status.HTTP_200_OK)
            except Exception:
                Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)
    
class PostRecord(APIView):
    record_type : str

    def post(self, request, RequestId):
        serializer = serializers.RecordSerializer(data=request.data, record_type=self.record_type)
        if serializer.is_valid():
            data = serializer.validated_data
            req = get_request(RequestId)
            if not req:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
            try:
                with transaction.atomic():
                    record = Record.objects.create(status='active', request=request)
                    object = Object.objects.get(id=data['object_id'])
                    info = {key : data[key] for key in data if key != 'object_id'}
                    RecordHistory.objects.create(action='created', modified_by=get_user(request), record=record, object=object, **info)
                    return Response(status=status.HTTP_201_CREATED)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)
    
class HumanRecord(PostRecord):
    record_type = 'human'

class CarRecord(PostRecord):
    record_type = 'car'

class DeleteRecord(APIView):

    @extend_schema(responses={
        status.HTTP_204_NO_CONTENT : None,
        status.HTTP_400_BAD_REQUEST: None,
        status.HTTP_401_UNAUTHORIZED : None
    })
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
        
class ChangeStatusRecord(APIView):

    @extend_schema(responses={
            status.HTTP_200_OK : None,
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED : None
    }, request=serializers.ChangeStatusSerializer, 
    description="status in ['closed', 'canceled']. Поле reason обязательно при status = canceled")
    def put(self, request, RecordId):
        record = get_record(RecordId)
        if not record:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
        serializer = serializers.ChangeStatusRequest(data=request.data)
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
    @extend_schema(responses={
            status.HTTP_200_OK : inline_serializer(name='record_history', 
            fields={
            'type' : ser.CharField(),
            'first_name' : ser.CharField(),
            'last_name' : ser.CharField(),
            'object' : ser.CharField(),
            'car_number' : ser.CharField(),
            'car_brand' : ser.CharField(),
            'car_model': ser.CharField(),
            'from_date': ser.DateTimeField(),
            'to_date': ser.DateTimeField(),
            'note': ser.CharField(),
            'action' : ser.CharField(),
            'timestamp' : ser.DateTimeField(),
            "modified_by" : ser.CharField()
            }),
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED : None
    })
    def get(self, _, RecordId):
        record = get_record(RecordId)
        if not record:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=RECORDID_ERROR_MSG)
        res = [rh.get_info() for rh in RecordHistory.objects.filter(record=record)]
        return Response(serializers.RecordSerializer(res, many=True, fields=GET_RECORD_HISTORY_FIELDS).data)
    
class RecordArchive(APIView):
    @extend_schema(responses={
            status.HTTP_200_OK : serializers.RecordSerializer(many=True, fields=REQUEST_GET_FIELDS),
            status.HTTP_400_BAD_REQUEST: None,
            status.HTTP_401_UNAUTHORIZED : None
    })
    def get(self, _, RequestId):
        req = get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST,  data=REQUESTID_ERROR_MSG)
        res = [record.get_info() for record in Record.objects.filter(request=req, status='outdated')]
        return Response(serializers.RecordSerializer(res, many=True, fields=REQUEST_GET_FIELDS).data)
 
        