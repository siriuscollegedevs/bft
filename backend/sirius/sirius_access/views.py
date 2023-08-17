from rest_framework.response import Response
from .models import Object, ObjectHistory, Account, AccountHistory, AccountToObject
from rest_framework import status
from django.db import transaction
from rest_framework.views import APIView
from . import serializers
from django.db.models import F
from sirius.general_functions import get_user, check_administrator, list_to_queryset
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers as ser
from .config import *
from sirius.config import DB_ERROR, NO_DATA_FOUND_ERROR


def check_name(name):
    for obj in Object.objects.filter(status='active'):
        if obj.get_info().name == name:
            return False
    return True

# WORK WITH OBJECTS


class GetObjects(APIView):
    status

    @extend_schema(responses={
        status.HTTP_200_OK: serializers.ObjectSerializer(many=True),
        status.HTTP_401_UNAUTHORIZED: None
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
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    }, request=inline_serializer(
        name='object_name',
        fields={'name': ser.CharField(), }
    ))
    def post(self, request):
        serializer = serializers.ObjectSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            name = serializer.validated_data['name']
            if not check_name(name):
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

    @extend_schema(responses={
        status.HTTP_201_CREATED: inline_serializer(
            name='object_name',
            fields={'name': ser.CharField(), }
        ),
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    })
    def get(self, _, ObjectId):
        try:
            obj = Object.objects.get(id=ObjectId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=OBJECTID_ERROR_MSG)
        name = obj.get_info().name
        return Response(serializers.ObjectSerializer({'name': name}).data)

    @extend_schema(responses={
        status.HTTP_204_NO_CONTENT: None,
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    })
    def delete(self, request, ObjectId):
        try:
            with transaction.atomic():
                obj = Object.objects.get(id=ObjectId)
                obj.status = 'outdated'
                obj.save()
                name = obj.get_info().name
                ObjectHistory.objects.create(
                    object=obj,
                    name=name,
                    modified_by=get_user(request),
                    action='deleted'
                )
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(responses={
        status.HTTP_200_OK: None,
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    }, request=inline_serializer(
        name='object_name',
        fields={'name': ser.CharField(), }
    ))
    def put(self, request, ObjectId):
        serializer = serializers.ObjectSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            name = serializer.validated_data['name']
            if not check_name(name):
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
        status.HTTP_200_OK: serializers.ObjectHistorySerializer,
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    })
    def get(self, _, ObjectId):
        try:
            obj = Object.objects.get(id=ObjectId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=OBJECTID_ERROR_MSG)
        res = ObjectHistory.objects.filter(object=obj).values(
            "name", "version", "timestamp", "action"
        ).annotate(modified_by=F('modified_by__user__username'))
        return Response(serializers.ObjectHistorySerializer(res, many=True).data)

# WORK WITH ACCOUNTS


class GetAccounts(APIView):
    status: str

    @extend_schema(responses={
        status.HTTP_200_OK: serializers.AccountSerializer(many=True, fields=GET_ACCOUNTS_FIELDS),
        status.HTTP_401_UNAUTHORIZED: None
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
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    }, request=inline_serializer(
        name='post_account',
        fields={key: ser.CharField() for key in ACCOUNT_GET_REQUEST_FIELDS}))
    def post(self, request):
        serializer = serializers.AccountSerializer(data=request.data, request_type='post')
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                if not check_administrator(request):
                    return Response(status=status.HTTP_403_FORBIDDEN)
                with transaction.atomic():
                    new_user = User.objects.create_user(username=data['username'], password=data['password'])
                    new_user.save()
                    new_account = Account.objects.create(status='active', user=new_user, role=data['role'])
                    account_history_data = {key: data[key]
                                            for key in data if key not in ['password', 'role', 'username']}
                    AccountHistory.objects.create(
                        action='created',
                        account=new_account,
                        modified_by=get_user(request),
                        **account_history_data
                    )
                    return Response(status=status.HTTP_201_CREATED)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class GetPutDeleteAccount(APIView):

    @extend_schema(responses={
        status.HTTP_200_OK: inline_serializer(
            name='get_account',
            fields={key: ser.CharField() for key in GET_ACCOUNT_FIELDS}),
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None})
    def get(self, _, AccountId):
        try:
            account = Account.objects.get(id=AccountId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=ACCOUNTID_ERROR_MSG)
        return Response(serializers.AccountSerializer(account.get_info()).data)

    @extend_schema(responses={
        status.HTTP_200_OK: None,
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    }, request=inline_serializer(name='put_account',
                                 fields={key: ser.CharField() for key in ['first_name', 'surname', 'last_name', 'password']}))
    def put(self, request, AccountId):
        serializer = serializers.AccountSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                with transaction.atomic():
                    account = Account.objects.get(id=AccountId)
                    if not check_administrator(request):
                        return Response(status=status.HTTP_403_FORBIDDEN)
                    user = User.objects.get(account=account)
                    if data.get('password', ''):
                        user.set_password(data['password'])
                        user.save()
                        action = 'password_changed'
                    else:
                        action = 'modified'
                    AccountHistory.objects.create(
                        action=action,
                        account=account,
                        modified_by=get_user(request),
                        **{key : data[key] for key in data if key not in ["password", "role", "username"]}
                    )
                    return Response(status=status.HTTP_200_OK)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

    @extend_schema(responses={
        status.HTTP_204_NO_CONTENT: None,
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    })
    def delete(self, request, AccountId):
        try:
            if not check_administrator(request):
                return Response(status=status.HTTP_403_FORBIDDEN)
            with transaction.atomic():
                account = Account.objects.get(id=AccountId)
                account.status = 'outdated'
                account.save()
                AccountHistory.objects.create(
                    account=account,
                    modified_by=get_user(request),
                    action='deleted',
                    **account.get_data_from_history()
                )
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChangePasswordApi(APIView):

    @extend_schema(responses={
        status.HTTP_200_OK: None,
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    }, request=serializers.ChangePasswordSerializer)
    def post(self, request, AccountId):
        serializer = serializers.ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            account = Account.objects.get(id=AccountId)
            user = User.objects.get(account=account)
            if data['status'] == 'administrator' or (user.check_password(data['current_password']) and account == get_user(request)):
                try:
                    with transaction.atomic():
                        user.set_password(data['new_password'])
                        user.save()
                        AccountHistory.objects.create(
                            account=account,
                            modified_by=get_user(request),
                            action='password_changed',
                            **account.get_data_from_history()
                        )
                        return Response(status=status.HTTP_200_OK)
                except Exception:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class AccountHistoryApiView(APIView):

    @extend_schema(responses={
        status.HTTP_200_OK: inline_serializer(
            many=True,
            name='account_history',
            fields={
                "role": ser.CharField(),
                "first_name": ser.CharField(),
                "surname": ser.CharField(),
                "last_name": ser.CharField(),
                "username": ser.CharField(),
                "modified_by": ser.CharField(),
                "action": ser.CharField(),
                "timestamp": ser.DateTimeField()}),
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    })
    def get(self, _, AccountId):
        try:
            account = Account.objects.get(id=AccountId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=ACCOUNTID_ERROR_MSG)
        res = AccountHistory.objects.filter(account=account).values("first_name", "last_name", "surname", "timestamp", "action")\
            .annotate(modified_by=F('modified_by__user__username'), username=F('account__user__username'), role=F('account__role'))
        return Response(serializers.AccountSerializer(res, many=True).data)


class AccountExpandSearch(APIView):
    status: str

    @extend_schema(responses={
        status.HTTP_200_OK: serializers.AccountSerializer(many=True, fields=GET_ACCOUNTS_FIELDS),
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    },
        request=inline_serializer(
        name='account_expand_search',
        fields={key: ser.CharField() for key in GET_ACCOUNT_FIELDS}))
    def post(self, request):
        if all(map(lambda key: key in GET_ACCOUNT_FIELDS, request.data.keys())):
            search_data = {key: value for key, value in request.data.items() if value}
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=INVALID_DATA_GIVEN_ERROR) ## NOTE переданы неизвестные атрибуты
        try:
            with transaction.atomic():
                res = []
                accounts = Account.objects.filter(status=self.status)
                if accounts:
                    if all([(not bool(value)) for value in list(request.data.values())]):
                        for account in accounts:
                            res.append(account.get_last_version().to_dict())
                        return Response(serializers.AccountSerializer(res, many=True, fields=GET_ACCOUNTS_FIELDS).data)
                    for account in accounts:
                        res.append(account.get_last_version())
                    res = list_to_queryset(AccountHistory, res).filter(**search_data).values(
                        'first_name', 'last_name', 'surname'
                    ).annotate(username=F('account__user__username'), id=F('account__id'), role=F('account__role'))
                    if res:
                        return Response(serializers.AccountSerializer(res, many=True, fields=GET_ACCOUNTS_FIELDS).data)
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_SEARCH_ACCOUNTS_FOUND_ERROR)
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_ACCOUNTS_FOUND_ERROR)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка транзакции


class ActualAccountExpandSearch(AccountExpandSearch):
    status = 'active'


class ArchiveAccountExpandSearch(AccountExpandSearch):
    status = 'outdated'


# ACCOUNT TO OBJECT VIEWS

class GetAccountByObjectView(APIView):
    status: str

    @extend_schema(responses={
        status.HTTP_200_OK: serializers.AccountSerializer(many=True, fields=GET_ACCOUNTS_FIELDS),
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    },
        request=inline_serializer(
        name='account_to_object_search',
           fields={'ids': ser.ListField(child=ser.UUIDField())}))
    def post(self, request):
        object_ids = request.data.get('ids', None)
        try:
            with transaction.atomic():
                if not object_ids:
                    res = []
                    for account in Account.objects.filter(status='active'):
                        if account is None:
                            break
                        res.append(account.get_last_version().to_dict())
                    if self.status == 'outdated':
                        for account in Account.objects.filter(status='outdated'):
                            res.append(account.get_last_version().to_dict())
                    return Response(serializers.AccountSerializer(res, many=True, fields=GET_ACCOUNTS_FIELDS).data)
                res = set()
                for iter, id in enumerate(object_ids):
                    accounts = set()
                    for record in AccountToObject.objects.filter(object__id=id, status=self.status):
                        if iter == 0:
                            res.add(record.account.id)
                        else:
                            accounts.add(record.account.id)
                    if iter != 0:
                        res.intersection_update(accounts)
                if res:
                    res_accounts = [Account.objects.get(id=acc_id).get_last_version().to_dict() for acc_id in res]
                    return Response(serializers.AccountSerializer(res_accounts, many=True, fields=GET_ACCOUNTS_FIELDS).data)
                return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_ACCOUNTS_BY_OBJECTS_FOUND_ERROR) # NOTE Аккаунты, закрепленные за данными объектами, не найдены.
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка транзакции


class GetActualAccountByObjectView(GetAccountByObjectView):
    status = 'active'


class GetArchiveAccountByObjectView(GetAccountByObjectView):
    status = 'outdated'


class GetPostActualAccountsObjectsView(APIView):

    @extend_schema(responses={
            status.HTTP_200_OK: serializers.AccountToObjectSerializer(many=True),
            status.HTTP_401_UNAUTHORIZED: None,
            status.HTTP_400_BAD_REQUEST: None
        })
    def get(self, _):
        res = []
        try:
            with transaction.atomic():
                all_accounts = Account.objects.filter(status='active')
                if all_accounts:
                    for account in all_accounts:
                        account_dict = account.get_last_version().to_dict()
                        account_dict['objects'] = []
                        all_matches = AccountToObject.objects.filter(account=account, status='active')
                        if all_matches:
                            for record in all_matches:
                                account_dict['objects'].append(record.object.get_info().name)
                            res.append(account_dict)
                    return Response(serializers.AccountToObjectSerializer(res, many=True).data)
                return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_MATCHES_FOUND_ERROR) # NOTE активные закрепления не найдены
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка в транзакции

    @extend_schema(responses={
        status.HTTP_201_CREATED: None,
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
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
                    account = AccountHistory.objects.filter(
                        account__status='active',
                        **data
                    ).order_by('-timestamp').first()
                    try:
                        account = account.account
                    except Exception:
                        return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_ACCOUNT_FOUND_ERROR) ## NOTE не удалось найти данный аккаунт среди активных
                    if account.role == 'security_officer':
                        if AccountToObject.objects.filter(account=account, status='active').exists():
                            return Response(status=status.HTTP_400_BAD_REQUEST, data=SECURITY_OFFICER_MATCH_ERROR) ## NOTE аккаунт типа Сотрудник охраны уже закреплен за 1 объектом
                        if len(object_ids) > 1:
                            return Response(status=status.HTTP_400_BAD_REQUEST, data=SECURITY_OFFICER_MATCH_ERROR) ## NOTE сотрудник охраны не может быть закреплен более чем за 1 объектом
                    for object_id in object_ids:
                        try:
                            object_ins = Object.objects.get(id=object_id)
                        except Exception:
                            return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_OBJECT_FOUND_ERROR) ## NOTE нет объекта соответствующего данному id
                        if AccountToObject.objects.filter(account=account, object=object_ins, status='active').exists():
                            object_name = object_ins.get_info().name
                            error = {"error": EXISTING_MATCH_ERROR['error'].format(object_name=object_name)}
                            return Response(status=status.HTTP_400_BAD_REQUEST, data=error) ## NOTE аккаунт уже закреплен за данным объектом
                        if AccountToObject.objects.filter(object=object_ins, account=account).exists():
                            try:
                                current_match = AccountToObject.objects.filter(object=object_ins, account=account)
                                current_match.status = 'active'
                            except Exception:
                                return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка бд
                        else:
                            try:
                                AccountToObject.objects.create(object=object_ins, account=account, status='active')
                            except Exception:
                                return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка бд
                    return Response(status=status.HTTP_201_CREATED)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка транзакции
        return Response(status=status.HTTP_400_BAD_REQUEST, data=INVALID_DATA_GIVEN_ERROR) ## NOTE ошибка при сериализации


class GetArchiveAccountsObjectsView(APIView):

    @extend_schema(responses={
            status.HTTP_200_OK: serializers.AccountToObjectSerializer(many=True),
            status.HTTP_401_UNAUTHORIZED : None,
            status.HTTP_400_BAD_REQUEST : None
        })
    def get(self, _):
        res = []
        try:
            with transaction.atomic():
                all_accounts = Account.objects.all()
                if all_accounts:
                    for account in all_accounts:
                        account_dict = account.get_last_version().to_dict()
                        account_dict['objects'] = []
                        all_matches = AccountToObject.objects.filter(account=account, status='outdated')
                        if all_matches:
                            for record in all_matches:
                                account_dict['objects'].append(record.object.get_info().name)
                            res.append(account_dict)
                    return Response(serializers.AccountToObjectSerializer(res, many=True).data)
                return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_MATCHES_FOUND_ERROR) # NOTE архивные закрепления не найдены
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка в транзакции


class GetPutDeleteAccountToObjectView(APIView):

    @extend_schema(responses={
        status.HTTP_200_OK: serializers.ObjectSerializer(many=True),
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    })
    def get(self, _, AccountId):
        try:
            account = Account.objects.get(id=AccountId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_ACCOUNT_FOUND_ERROR) ## NOTE аккаунта с таким id не существует или id не верен
        try:
            with transaction.atomic():
                res = []
                all_records = AccountToObject.objects.filter(account=account, status='active')
                if not all_records:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_ACCOUNT_MATCHES_ERROR) ## NOTE за данным аккаунтом не найдено закреплений
                for record in all_records:
                    res.append(
                        {
                            "id": record.object.id,
                            "name": record.object.get_info().name
                        }
                    )
                return Response(serializers.ObjectSerializer(res, many=True).data)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка транзакции

    @extend_schema(responses={
        status.HTTP_200_OK: None,
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    },
        request=inline_serializer(
        name='account_to_object_put',
        fields={
            'object_ids': ser.ListField(child=ser.UUIDField())
        }))
    def put(self, request, AccountId):
        object_ids = request.data.get('object_ids', None)
        if not object_ids:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_OBJECTS_GIVEN_ERROR) ## NOTE список с id пустой
        try:
            account = Account.objects.get(id=AccountId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_ACCOUNT_FOUND_ERROR) ## NOTE аккаунта с таким id не существует или id не верен
        if account.status == 'outdated':
            return Response(status=status.HTTP_400_BAD_REQUEST, data=ACCOUNT_ARCHIVE_ERROR) ## NOTE аккаунт находится в архиве
        try:
            with transaction.atomic():
                AccountToObject.objects.filter(account=account, status='active').delete()
                for object_id in object_ids:
                    try:
                        object_ins = Object.objects.get(id=object_id)
                    except Exception:
                        return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_OBJECT_FOUND_ERROR) ## NOTE объекта с таким id не существует
                    AccountToObject.objects.create(object=object_ins, account=account, status='active')
                return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка транзакции

    @extend_schema(responses={
        status.HTTP_204_NO_CONTENT: None,
        status.HTTP_401_UNAUTHORIZED: None,
        status.HTTP_400_BAD_REQUEST: None
    })
    def delete(self, request, AccountId):
        # TODO вместо проверки на администратора сделать permissions
        if not check_administrator(request):
            return Response(status=status.HTTP_403_FORBIDDEN)  # NOTE роль аккаунта НЕ администратор
        try:
            account = Account.objects.get(id=AccountId)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_ACCOUNT_FOUND_ERROR) ## NOTE аккаунта с таким id не существует или id не верен
        try:
            with transaction.atomic():
                active_matches = AccountToObject.objects.filter(account=account, status='active')
                if not active_matches:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_ACCOUNT_MATCHES_ERROR) # NOTE за данным сотрудником не найдено закреплений
                for match in active_matches:
                    match.status = 'outdated'
                    match.save()
                return Response(status=status.HTTP_204_NO_CONTENT, data=SUCCESS_MATCH_DELETION)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка транзакции


class AccountToObjectExpandSearchView(APIView):
    status: str

    @extend_schema(responses={
            status.HTTP_200_OK: serializers.AccountToObjectSerializer(many=True),
            status.HTTP_401_UNAUTHORIZED : None,
            status.HTTP_400_BAD_REQUEST : None
        },
        request=inline_serializer(
        name='account_to_object_search',
           fields={
               'first_name': ser.CharField(),
               'last_name': ser.CharField(),
               'surname': ser.CharField(),
               'objects': ser.ListField(child=ser.CharField())
            }))
    def post(self, request):
        account_keys = ('first_name', 'last_name', 'surname')
        search_account = {key: value for key, value in request.data.items() if key in account_keys and value}
        res_accounts, objects, res = [], [], []
        if search_account:
            try:
                with transaction.atomic():
                    if self.status == 'active':
                        account_queryset = Account.objects.filter(status=self.status)
                    else:
                        account_queryset = Account.objects.all()
                    accounts = list_to_queryset(
                        AccountHistory,
                        [account.get_last_version() for account in account_queryset]
                    ).filter(**search_account)
                    if accounts:
                        res_accounts = [account.account for account in accounts]
                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_SEARCH_ACCOUNTS_FOUND_ERROR) # NOTE аккаунты по запросу не найдены
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) # NOTE ошибка транзакции
        object_search = request.data.get('objects')
        if object_search:
            try:
                objects = [
                    Object.objects.get(id=object_id) for object_id in object_search
                ]
                if not objects:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_SEARCH_OBJECTS_FOUND_ERROR) # NOTE объекты по запросу не найдены
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_SEARCH_OBJECTS_FOUND_ERROR) # NOTE объекты по запросу не найдены
        elif not (search_account or object_search):
            try:
                with transaction.atomic():
                    if self.status == 'active':
                        all_accounts = Account.objects.filter(status='active')
                    else:
                        all_accounts = Account.objects.all()
                    if all_accounts:
                        for account in all_accounts:
                            account_dict = account.get_last_version().to_dict()
                            account_dict['objects'] = []
                            all_matches = AccountToObject.objects.filter(account=account, status=self.status)
                            if all_matches:
                                for record in all_matches:
                                    account_dict['objects'].append(record.object.get_info().name)
                                res.append(account_dict)
                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_MATCHES_FOUND_ERROR) # NOTE закрепления не найжены
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) ## NOTE ошибка в транзакции
        if res_accounts and objects:
            try:
                with transaction.atomic():
                    for account in res_accounts:
                        account_res = account.get_last_version().to_dict()
                        account_res['objects'] = []
                        if all(
                            map(
                                lambda object_ins: AccountToObject.objects.filter(account=account, object=object_ins, status=self.status).exists(),
                                objects
                            )
                        ):
                            all_matches = AccountToObject.objects.filter(account=account, status=self.status)
                            if all_matches:
                                for record in all_matches:
                                    account_res['objects'].append(record.object.get_info().name)
                                res.append(account_res)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) # NOTE ошибка транзакции
        elif res_accounts:
            try:
                with transaction.atomic():
                    for account in res_accounts:
                        account_res = account.get_last_version().to_dict()
                        account_res['objects'] = []
                        all_matches = AccountToObject.objects.filter(account=account, status=self.status)
                        if all_matches:
                            for record in all_matches:
                                account_res['objects'].append(record.object.get_info().name)
                        res.append(account_res)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) # NOTE ошибка транзакции
        elif objects:
            try:
                with transaction.atomic():
                    res_accounts = set()
                    for index, object_ins in enumerate(objects):
                            accounts = set()
                            db_records = AccountToObject.objects.filter(object=object_ins, status=self.status)
                            if not db_records:
                                return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_MATCHES_FOUND_ERROR) # NOTE закрепления по переданным объектам не найдены
                            for db_record in db_records:
                                if index == 0:
                                    res_accounts.add(db_record.account)
                                else:
                                    accounts.add(db_record.account)
                            if index != 0:
                                res_accounts.intersection_update(accounts)
                    for account in res_accounts:
                        account_res = account.get_last_version().to_dict()
                        account_res['objects'] = []
                        for record in AccountToObject.objects.filter(account=account, status=self.status):
                            account_res['objects'].append(record.object.get_info().name)
                        res.append(account_res)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=DB_ERROR) # NOTE ошибка транзакции
        if res:
            return Response(serializers.AccountToObjectSerializer(res, many=True).data)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=NO_DATA_FOUND_ERROR) # NOTE данные не найдены


class ActualAccountToObjectExpandSearchView(AccountToObjectExpandSearchView):
    status = 'active'


class ArchiveAccountToObjectExpandSearchView(AccountToObjectExpandSearchView):
    status = 'outdated'
