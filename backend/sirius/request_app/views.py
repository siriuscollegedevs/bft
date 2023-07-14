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
        serializer = serializers.ChangeStatusRequest(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            note = data['reason'] if data['status'] == 'canceled' else ''
            req.make_outdated(user=get_user(request), action=data['status'], note=note)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)