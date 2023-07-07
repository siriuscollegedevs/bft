from rest_framework.response import Response
from .models import Object, ObjectHistory, Account
from rest_framework import status
from django.db import transaction
from rest_framework.views import APIView
from . import serializers
from django.db.models import F
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken


class GetObjects(APIView):
    status 

    def get(self, _):
        res = []
        for obj in Object.objects.filter(status=self.status):
            res.append({'id': obj.id, 'name': obj.get_info().name})
        return Response(serializers.ObjectSerializer(res, many=True).data)

class GetArchiveObjects(GetObjects):
    status = 'outdated'

class GetActualObjects(GetObjects):
    status = 'active'

class ObjectApiView(APIView):
    
    @staticmethod
    def check_name(name):
        for obj in Object.objects.filter(status='active'):
            if obj.get_info().name == name:
                return False
        return True

    @staticmethod
    def get_user(request):
        access_token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
        token = AccessToken(access_token)
        user = User.objects.get(id=token.payload['user_id'])
        return Account.objects.get(user=user)

    def get(self, _, ObjectId):
        try:
            obj = Object.objects.get(id=ObjectId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        name = obj.get_info().name
        return Response(serializers.ObjectSerializer({'name': name}).data)

    def post(self, request):
        serializer = serializers.ObjectSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            name = serializer.validated_data['name']
            if not self.check_name(name):
                return Response(status=status.HTTP_409_CONFLICT)
            try:
                with transaction.atomic():
                    obj = Object.objects.create(status='active')
                    ObjectHistory.objects.create(
                        object=obj, name=name, modified_by=self.get_user(request), action='created')
                return Response(status=status.HTTP_201_CREATED)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, ObjectId):
        try:
            with transaction.atomic():
                obj = Object.objects.get(id=ObjectId)
                obj.status = 'outdated'
                obj.save()
                name = obj.get_info().name
                ObjectHistory.objects.create(
                    object=obj, name=name, modified_by=self.get_user(request), action='deleted')
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request):
        serializer = serializers.ObjectPutSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            name = serializer.validated_data['name']
            if not self.check_name(name):
                return Response(status=status.HTTP_409_CONFLICT)
            try:
                with transaction.atomic():
                    obj = Object.objects.get(id=serializer.validated_data['id'])
                    version = obj.get_info().version + 1
                    ObjectHistory.objects.create(
                        object=obj, name=name, modified_by=self.get_user(request), action='modified', version=version)
                    return Response(status=status.HTTP_200_OK)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ObjectHistoryApiView(APIView):
    def get(self, _, ObjectId):
        try:
            obj = Object.objects.get(id=ObjectId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        res = ObjectHistory.objects.filter(object=obj).values("name", "version", "timestamp", "action").annotate(modified_by=F('modified_by__user__username'))
        return Response(serializers.ObjectHistorySerializer(res, many=True).data)
