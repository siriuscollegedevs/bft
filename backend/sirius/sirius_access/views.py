from rest_framework.response import Response
from .models import Object, ObjectHistory, Account, AccountHistory, AccountToObject
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
from sirius import general_functions as gf


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
            res.append({'id': obj.id, 'name': obj.get_last_version().name})
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
                        object=obj, name=name, modified_by=gf.get_account(request), action='created')
                return Response(status=status.HTTP_201_CREATED)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ObjectApiView(APIView):

    @staticmethod
    def check_name(name):
        for obj in Object.objects.filter(status='active'):
            if obj.get_last_version().name == name:
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
        name = obj.get_last_version().name
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
                name = obj.get_last_version().name
                ObjectHistory.objects.create(
                    object=obj, name=name, modified_by=gf.get_account(request), action='deleted')
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
                    version = obj.get_last_version().version + 1
                    ObjectHistory.objects.create(
                        object=obj, name=name, modified_by=gf.get_account(request), action='modified', version=version)
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
                if not gf.check_administrator(gf.get_account(request)):
                        return Response(status=status.HTTP_400_BAD_REQUEST)
                with transaction.atomic():
                    new_user = User.objects.create_user(username=data['username'], password=data['password'])
                    new_user.save()
                    new_account = Account.objects.create(status='active', user=new_user)
                    account_history_data = {key: data[key] for key in data if key != 'password'}
                    AccountHistory.objects.create(action='created', account=new_account, modified_by=gf.get_account(request), **account_history_data)
                    return Response(status=status.HTTP_201_CREATED)
            except Exception as ex:
                print(ex)
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


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
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(serializers.AccountSerializer(account.get_info()).data)

    @extend_schema(responses={
        status.HTTP_200_OK: None,
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    }, request=inline_serializer(name='post_account', fields={}))
    def put(self, request, AccountId):
        serializer = serializers.AccountSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                with transaction.atomic():
                    account = Account.objects.get(id=AccountId)
                    if not gf.check_administrator(gf.get_account(request)):
                        return Response(status=status.HTTP_400_BAD_REQUEST)
                    user = User.objects.get(account=account)
                    if data['username'] != user.username:
                        user.username = data['username']
                    if data.get('password', ''):
                        user.set_password(data['password'])
                        action = 'password_changed'
                    else:
                        action = 'modified'
                    user.save()
                    account_history_data = {key: data[key] for key in data if key != 'password'}
                    AccountHistory.objects.create(action=action, account=account, modified_by=gf.get_account(request), **account_history_data) 
                    return Response(status=status.HTTP_200_OK)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(responses={
        status.HTTP_204_NO_CONTENT : None,
        status.HTTP_401_UNAUTHORIZED : None,
        status.HTTP_400_BAD_REQUEST : None
    })
    def delete(self, request, AccountId):
        try:
            if not gf.check_administrator(gf.get_account(request)):
                        return Response(status=status.HTTP_400_BAD_REQUEST)
            with transaction.atomic():
                account = Account.objects.get(id=AccountId)
                account.status = 'outdated'
                account.save()
                AccountHistory.objects.create(
                    account=account, modified_by=gf.get_account(request), action='deleted', **account.get_info())
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
            if data['status'] == 'Administrator' or (user.check_password(data['current_password']) and account == gf.get_account(request)):
                try:
                    with transaction.atomic():
                        user.set_password(data['new_password'])
                        user.save()
                        AccountHistory.objects.create(account=account, modified_by=gf.get_account(request), action='password_changed', **account.get_info())
                        return Response(status=status.HTTP_200_OK)
                except Exception:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


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
            return Response(status=status.HTTP_400_BAD_REQUEST)
        res = AccountHistory.objects.filter(account=account).values("role", "first_name", "last_name", "surname", "username", "timestamp", "action").annotate(modified_by=F('modified_by__user__username'))
        return Response(serializers.AccountSerializer(res, many=True).data)


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
        try:
            with transaction.atomic():
                if all([(not bool(value)) for value in list(request.data.values())]):
                    res = []
                    for account in Account.objects.filter(status='active'):
                        res.append(account.get_last_version().to_dict())
                    return Response(serializers.AccountSerializer(res, many=True, fields=GET_ACCOUNTS_FIELDS).data)
                active_accounts = Account.objects.filter(status='active')
                res = []
                for account in active_accounts:
                    res.append(account.get_last_version())
                res = gf.list_to_queryset(AccountHistory, res).filter(**search_data).values(
                    'role',
                    'first_name',
                    'last_name',
                    'surname'
                    ).annotate(username=F('account__user__username'), id=F('account__id'))
                return Response(serializers.AccountSerializer(res, many=True, fields=GET_ACCOUNTS_FIELDS).data)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# ACCOUNT TO OBJECT VIEWS

class GetAccountByObjectView(APIView):

    @extend_schema(responses={
            status.HTTP_200_OK:serializers.AccountSerializer(many=True, fields=GET_ACCOUNTS_FIELDS), 
            status.HTTP_401_UNAUTHORIZED : None,
            status.HTTP_400_BAD_REQUEST : None
        },
        request=inline_serializer(
        name='account_to_object_search',
           fields={'ids': ser.ListField()}))
    def post(self, request):
        object_ids = request.data.get('ids', None)
        try:
            with transaction.atomic():
                if object_ids is None:
                    res = []
                    for account in Account.objects.filter(status='active'):
                        res.append(account.get_last_version().to_dict())
                    return Response(serializers.AccountSerializer(res, many=True, fields=GET_ACCOUNTS_FIELDS).data)
                res = set()
                for iter, id in object_ids.enumerate():
                    for record in AccountToObject.objects.filter(object__id=id):
                        if iter == 0:
                            res.add(record.account.get_last_version())
                        else:
                            accounts = set()
                            accounts.add(record.account.get_last_version())
                    res.intersection_update(accounts)
                if res:
                    res_accounts = [record.to_dict() for record in res]
                    return Response(serializers.AccountSerializer(res_accounts, many=True, fileds=GET_ACCOUNTS_FIELDS).data)
                return Response(data={[]})
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetPostAccountsObjectsView(APIView):

    @extend_schema(responses={
            status.HTTP_200_OK : inline_serializer(
                many=True, 
                name='account_and_objects', 
                fields={
                    "id" : ser.UUIDField(),
                    "role" : ser.CharField(),
                    "first_name" : ser.CharField(),
                    "surname" : ser.CharField(),
                    "last_name" : ser.CharField(),
                    "username" : ser.CharField(),
                    "objects": ser.ListField()}),
            status.HTTP_401_UNAUTHORIZED : None,
            status.HTTP_400_BAD_REQUEST : None
        })
    def get(self, _):
        res = []
        try:
            with transaction.atomic():
                for account in Account.objects.filter(status='active'):
                    account_dict = account.get_last_version().to_dict()
                    account_dict['objects'] = []
                    all_matches = AccountToObject.objects.filter(account=account)
                    if all_matches:
                        for record in all_matches:
                            account_dict['objects'].append(record.object.get_last_version().name)
                    res.append(account_dict)
                return Response(serializers.AccountSerializer(res, many=True, fields=GET_ACCOUNT_OBJECTS_FIELDS).data)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST) ## NOTE ошибка в транзакции

    @extend_schema(responses={
            status.HTTP_200_OK: None, 
            status.HTTP_401_UNAUTHORIZED : None,
            status.HTTP_400_BAD_REQUEST : None
        },
        request=inline_serializer(
        name='account_to_object_create',
           fields={
               'first_name': ser.CharField(),
               'last_name': ser.CharField(),
               'surname': ser.CharField(),
               'ids': ser.ListField()
            }))
    def post(self, request):
        serializer = serializers.AccountObjectSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            object_ids = data.pop('object_ids')
            try:
                with transaction.atomic():
                    try:
                        account = Account.objects.get(**data)
                    except Exception:
                        return Response(status=status.HTTP_400_BAD_REQUEST) ## NOTE нельзя точно определить аккаунт по фио
                    for object_id in object_ids:
                        try:
                            object_ins = Object.objects.get(id=object_id)
                        except Exception:
                            return Response(status=status.HTTP_400_BAD_REQUEST) ## NOTE нет объекта соответствующего данному id
                        AccountToObject.objects.create(object=object_ins, account=account)
                    return Response(status=status.HTTP_200_OK)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST) ## NOTE ошибка транзакции
        return Response(status=status.HTTP_400_BAD_REQUEST) ## NOTE ошибка при сериализации
