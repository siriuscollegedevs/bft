from rest_framework.response import Response
from .models import Object, ObjectHistory, Account
from rest_framework import status
from django.db import transaction
from rest_framework.views import APIView
from . import serializers
from django.db.models import F
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers as ser


def get_user(request):
        access_token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
        token = AccessToken(access_token)
        user = User.objects.get(id=token.payload['user_id'])
        return Account.objects.get(user=user)

class GetObjects(APIView):
    status 

    @extend_schema(responses={
            status.HTTP_200_OK:serializers.ObjectSerializer(many=True), 
            status.HTTP_401_UNAUTHORIZED : None
        })
    def get(self, _):
        res = []
        for obj in Object.objects.filter(status=self.status):
            res.append({'id': obj.id, 'name': obj.get_info().name})
        return Response(serializers.ObjectSerializer(res, many=True).data)

class GetArchiveObjects(GetObjects):
    status = 'outdated'

class GetActualObjects(GetObjects):
    status = 'active'

class PostObject(APIView):
    @extend_schema(responses={
        status.HTTP_201_CREATED: None,
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    }, request=inline_serializer(
        name='object_name',
           fields={'name': ser.CharField(),}
       ))
    def post(self, request):
        serializer = serializers.ObjectSerializer(data=request.data, request_type='post')
        if serializer.is_valid(raise_exception=True):
            name = serializer.validated_data['name']
            if not self.check_name(name):
                return Response(status=status.HTTP_409_CONFLICT)
            try:
                with transaction.atomic():
                    obj = Object.objects.create(status='active')
                    ObjectHistory.objects.create(
                        object=obj, name=name, modified_by=get_user(request), action='created')
                return Response(status=status.HTTP_201_CREATED)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class ObjectApiView(APIView):
    
    @staticmethod
    def check_name(name):
        for obj in Object.objects.filter(status='active'):
            if obj.get_info().name == name:
                return False
        return True

    @extend_schema(responses={
        status.HTTP_201_CREATED: inline_serializer(
        name='object_name',
           fields={'name': ser.CharField(),}
       ),
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    })
    def get(self, _, ObjectId):
        try:
            obj = Object.objects.get(id=ObjectId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        name = obj.get_info().name
        return Response(serializers.ObjectSerializer({'name': name}).data)

    @extend_schema(responses={
        status.HTTP_204_NO_CONTENT : None,
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    })
    def delete(self, request, ObjectId):
        try:
            with transaction.atomic():
                obj = Object.objects.get(id=ObjectId)
                obj.status = 'outdated'
                obj.save()
                name = obj.get_info().name
                ObjectHistory.objects.create(
                    object=obj, name=name, modified_by=get_user(request), action='deleted')
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(responses={
        status.HTTP_200_OK : None,
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    }, request=inline_serializer(
        name='object_name',
           fields={'name': ser.CharField(),}
       ))
    def put(self, request, ObjectId):
        serializer = serializers.ObjectSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            name = serializer.validated_data['name']
            if not self.check_name(name):
                return Response(status=status.HTTP_409_CONFLICT)
            try:
                with transaction.atomic():
                    obj = Object.objects.get(id=ObjectId)
                    version = obj.get_info().version + 1
                    ObjectHistory.objects.create(
                        object=obj, name=name, modified_by=get_user(request), action='modified', version=version)
                    return Response(status=status.HTTP_200_OK)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ObjectHistoryApiView(APIView):
    @extend_schema(responses={
        status.HTTP_200_OK : serializers.ObjectHistorySerializer,
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    })
    def get(self, _, ObjectId):
        try:
            obj = Object.objects.get(id=ObjectId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        res = ObjectHistory.objects.filter(object=obj).values("name", "version", "timestamp", "action").annotate(modified_by=F('modified_by__user__username'))
        return Response(serializers.ObjectHistorySerializer(res, many=True).data)
