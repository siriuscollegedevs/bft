from sirius_access.models import Account
from django.db.models import Model, QuerySet


def get_account(request) -> Account:
    return Account.objects.get(user=request.user)

def check_administrator(account) -> bool:
    return account.get_last_version().role == 'administrator'

def list_to_queryset(model: Model, data: list) -> QuerySet:
    pks = [obj.id for obj in data]
    return model.objects.filter(id__in=pks)
