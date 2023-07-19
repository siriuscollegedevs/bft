from rest_framework.response import Response
from .models import Object, ObjectHistory, Account, AccountHistory
from rest_framework import status
from django.db import transaction
from rest_framework.views import APIView
from . import serializers
from django.db.models import F, Model, QuerySet
from sirius.general_functions import get_user, check_administrator
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers as ser
from .config import *
from sirius.config import USELESS_FIELDS, FIELDS_TO_ADD


# WORK WITH OBJECTS

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
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


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
            return Response(status=status.HTTP_400_BAD_REQUEST, data=OBJECTID_ERROR_MSG)
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
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


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
            return Response(status=status.HTTP_400_BAD_REQUEST, data=OBJECTID_ERROR_MSG)
        res = ObjectHistory.objects.filter(object=obj).values("name", "version", "timestamp", "action").annotate(modified_by=F('modified_by__user__username'))
        return Response(serializers.ObjectHistorySerializer(res, many=True).data)

#WORK WITH ACCOUNTS

class GetAccounts(APIView):
    status: str

    @extend_schema(responses={
            status.HTTP_200_OK:serializers.AccountSerializer(many=True, fields=GET_ACCOUNTS_FIELDS), 
            status.HTTP_401_UNAUTHORIZED : None
        })
    def get(self, _):
        res = []
        for account in Account.objects.filter(status=self.status):
            res.append(account.get_last_version().to_dict())
        return Response(serializers.AccountSerializer(res, many=True, fields=GET_ACCOUNTS_FIELDS).data)


class GetArchiveAccounts(GetAccounts):
    status = 'outdated'


class GetActualAccounts(GetAccounts):
    status = 'active'


class PostAccount(APIView):

    @extend_schema(responses={
        status.HTTP_201_CREATED: None,
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    }, request=inline_serializer(
        name='post_account',
           fields={key : ser.CharField() for key in ACCOUNT_GET_REQUEST_FIELDS}))
    def post(self, request):
        serializer = serializers.AccountSerializer(data=request.data, request_type='post')
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                if not check_administrator(get_user(request)):
                        return Response(status=status.HTTP_400_BAD_REQUEST)
                with transaction.atomic():
                    new_user = User.objects.create_user(username=data['username'], password=data['password'])
                    new_user.save()
                    new_account = Account.objects.create(status='active', user=new_user, role=data['role'])
                    account_history_data = {key: data[key] for key in data if key not in ['password', 'role', 'username']}
                    AccountHistory.objects.create(action='created', account=new_account, modified_by=get_user(request), **account_history_data)
                    return Response(status=status.HTTP_201_CREATED)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class GetPutDeleteAccount(APIView):

    @extend_schema(responses={
        status.HTTP_200_OK: inline_serializer(
        name='get_account',
           fields={key : ser.CharField() for key in GET_ACCOUNT_FIELDS}),
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None})
    def get(self, _, AccountId):
        try:
            account = Account.objects.get(id=AccountId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=ACCOUNTID_ERROR_MSG)
        return Response(serializers.AccountSerializer(account.get_info()).data)

    @extend_schema(responses={
        status.HTTP_200_OK: None,
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    }, request=inline_serializer(name='put_account', 
    fields={key : ser.CharField() for key in ['first_name', 'surname', 'last_name', 'password']}))
    def put(self, request, AccountId):
        serializer = serializers.AccountSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                with transaction.atomic():
                    account = Account.objects.get(id=AccountId)
                    if not check_administrator(get_user(request)):
                        return Response(status=status.HTTP_400_BAD_REQUEST)
                    user = User.objects.get(account=account)
                    if data.get('password', ''):
                        user.set_password(data['password'])
                        user.save()
                        action = 'password_changed'
                    else:
                        action = 'modified'
                    new_data = {key : data[key] for key in data if data[key] and key != 'password'}
                    info = account.get_last_version().__dict__
                    old_data = {key : info[key] for key in info if key not in new_data.keys() and key not in USELESS_FIELDS + FIELDS_TO_ADD}
                    AccountHistory.objects.create(action=action, account=account, modified_by=get_user(request), **old_data, **new_data) 
                    return Response(status=status.HTTP_200_OK)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

    @extend_schema(responses={
        status.HTTP_204_NO_CONTENT : None,
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    })
    def delete(self, request, AccountId):
        try:
            if not check_administrator(get_user(request)):
                        return Response(status=status.HTTP_400_BAD_REQUEST)
            with transaction.atomic():
                account = Account.objects.get(id=AccountId)
                account.status = 'outdated'
                account.save()
                AccountHistory.objects.create(
                    account=account, modified_by=get_user(request), action='deleted', **account.get_data_from_history())
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChangePasswordApi(APIView):

    @extend_schema(responses={
        status.HTTP_200_OK: None,
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    }, request=serializers.ChangePasswordSerializer)
    def post(self, request, AccountId):
        serializer = serializers.ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            account = Account.objects.get(id=AccountId)
            user = User.objects.get(account=account)
            if data['status'] == 'Administrator' or (user.check_password(data['current_password']) and account == get_user(request)):
                try:
                    with transaction.atomic():
                        user.set_password(data['new_password'])
                        user.save()
                        AccountHistory.objects.create(account=account, modified_by=get_user(request), action='password_changed', **account.get_data_from_history())
                        return Response(status=status.HTTP_200_OK)
                except Exception:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class AccountHistoryApiView(APIView):

    @extend_schema(responses={
            status.HTTP_200_OK : inline_serializer(
                many=True, 
                name='account_history', 
                fields={
                    "role" : ser.CharField(),
                    "first_name" : ser.CharField(),
                    "surname" : ser.CharField(),
                    "last_name" : ser.CharField(),
                    "username" : ser.CharField(),
                    "modified_by" : ser.CharField(),
                    "action" : ser.CharField(),
                    "password" : ser.CharField(),
                    "timestamp" : ser.DateTimeField()}),
            status.HTTP_401_UNAUTHORIZED : None,
            status.HTTP_400_BAD_REQUEST : None
        })
    def get(self, _, AccountId):
        try:
            account = Account.objects.get(id=AccountId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=ACCOUNTID_ERROR_MSG)
        res = AccountHistory.objects.filter(account=account).values("first_name", "last_name", "surname", "timestamp", "action")\
                .annotate(modified_by=F('modified_by__user__username'), username=F('account__user__username'), role=F('account__role'))
        return Response(serializers.AccountSerializer(res, many=True).data)


def list_to_queryset(model: Model, data: list) -> QuerySet:
    pks = [obj.id for obj in data]
    return model.objects.filter(id__in=pks)


class AccountExpandSearch(APIView):

    @extend_schema(responses={
            status.HTTP_200_OK:serializers.AccountSerializer(many=True, fields=GET_ACCOUNTS_FIELDS), 
            status.HTTP_401_UNAUTHORIZED : None,
            status.HTTP_400_BAD_REQUEST : None
        },
        request=inline_serializer(
        name='account_expand_search',
           fields={key : ser.CharField() for key in GET_ACCOUNT_FIELDS}))
    def post(self, request):
        search_data = {key: value for key, value in request.data.items() if value}
        if all([(not bool(value)) for value in list(request.data.values())]):
            res = []
            for account in Account.objects.filter(status='active'):
                res.append(account.get_last_version().to_dict())
            return Response(serializers.AccountSerializer(res, many=True, fields=GET_ACCOUNTS_FIELDS).data)
        active_accounts = Account.objects.filter(status='active')
        res = []
        for account in active_accounts:
            res.append(account.get_last_version())
        res = list_to_queryset(AccountHistory, res).filter(**search_data).values(
            'role',
            'first_name',
            'last_name',
            'surname'
            ).annotate(username=F('account__user__username'), id=F('account__id'))
        return Response(serializers.AccountSerializer(res, many=True, fields=GET_ACCOUNTS_FIELDS).data)
