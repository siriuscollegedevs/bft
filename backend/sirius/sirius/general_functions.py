from sirius_access.models import Account
from django.db.models import Model, QuerySet


def get_user(request) -> Account:
    return Account.objects.get(user=request.user)

def check_administrator(request) -> bool:
    return get_user(request).role == 'administrator'

def list_to_queryset(model: Model, data: list) -> QuerySet:
    pks = [obj.id for obj in data]
    return model.objects.filter(id__in=pks)
