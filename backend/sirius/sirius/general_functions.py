from sirius_access.models import Account
from request_app.models import RequestHistory
from django.db.models import Model, QuerySet


def get_user(request) -> Account:
    return Account.objects.get(user=request.user)

def check_administrator(request) -> bool:
    return get_user(request).role == 'administrator'

def list_to_queryset(model: Model, data: list) -> QuerySet:
    pks = [obj.id for obj in data]
    return model.objects.filter(id__in=pks)

def get_max_code():
    for elem in RequestHistory.objects.order_by('-timestamp'):
        if elem.code.isdigit():
            return int(elem)
    return 0