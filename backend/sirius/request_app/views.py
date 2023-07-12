from rest_framework.response import Response
from .models import Request, RequestHistory, Record, RecordHistory
from sirius_access.models import Account, Object
from rest_framework import status
from django.db import transaction
from rest_framework.views import APIView
from . import serializers
from sirius_access.views import get_user

class PostRequest(APIView):
     def post(self, request):
        serializer = serializers.RequestSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            try:
                with transaction.atomic():
                    request = Request.objects.create(status='active')
                    code = code if code else request.id
                    request_info = RequestHistory.objects.create(request=request, code=code, action='created', modified_by=get_user(request))
                    return Response(serializers.RequestSerializer({'id': request.id, 'code' : code, 'timestamp' :request_info.timestamp}).data)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)
     