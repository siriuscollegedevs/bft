from rest_framework.response import Response
from .models import Request, RequestHistory, Record, RecordHistory
from sirius_access.models import Account, Object
from rest_framework import status
from django.db import transaction
from rest_framework.views import APIView
from . import serializers
from sirius.general_functions import get_user

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
     def post(self, request):
        serializer = serializers.RequestSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            try:
                with transaction.atomic():
                    request = Request.objects.create(status='active')
                    code = code if code else request.id #NOTE
                    request_info = RequestHistory.objects.create(request=request, code=code, action='created', modified_by=get_user(request))
                    return Response(serializers.RequestSerializer({'id': request.id, 'code' : code, 'timestamp' :request_info.timestamp}).data)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)
     
class RequestApiView(APIView):

    def get(self, _, RequestId):
        res = []
        req = get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        res= [record.get_info() for record in Record.objects.filter(request=req, status='active')]
        return Response(serializers.RecordSerializer(res, many=True).data)

    def delete(self, request, RequestId):
        req = self.get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                req.make_outdated(user=get_user(request), action='deleted')
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)
    
class ChangeStatusRequest(APIView):
    def put(self, request, RequestId):
        req = get_request(RequestId)
        if not req:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = serializers.ChangeStatusSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                with transaction.atomic():
                    req.make_outdated(user=get_user(request), action=data['status'], note=data.get('reason', ''))
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
                return Response(status=status.HTTP_400_BAD_REQUEST)
            try:
                with transaction.atomic():
                    record = Record.objects.create(status='active', request=request)
                    object = Object.objects.get(id=data['object_id'])
                    info = {key : data[key] for key in data if key != 'object_id'}
                    RecordHistory.objects.create(action='created', modified_by=get_user(request), record=record, object=object, **info)
                    return Response(status=status.HTTP_200_OK)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)
    
class HumanRecord(PostRecord):
    record_type = 'human'

class CarRecord(PostRecord):
    record_type = 'car'

class DeleteRecord(APIView):
    def delete(self, request, RecordId):
        record = get_record(RecordId)
        if not record:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error' : 'Invalid RecordId'})
        try:
            with transaction.atomic():
                record.make_outdated(user=get_user(request), action='deleted')
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        