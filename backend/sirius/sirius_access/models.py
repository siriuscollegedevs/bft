from django.db import models
from uuid import uuid4
from django.core.exceptions import ValidationError
from .config import ACCOUNT_TYPE_LEN, TYPE_CHOICES_ACCOUNT, ACTION_ACCOUNT_LEN, ACCOUNT_HISTORY_CHOICES
from sirius.config import *
from django.conf.global_settings import AUTH_USER_MODEL


class UUIDMixin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    class Meta:
        abstract = True


class Object(UUIDMixin, models.Model):
    status = models.CharField(max_length=STATUS_LEN, choices=STATUS_CHOICES)

    def get_info(self):
        return ObjectHistory.objects.filter(object=self).order_by('-timestamp').first()

    class Meta:
        db_table = 'objects'


class Account(UUIDMixin, models.Model):
    status = models.CharField(max_length=STATUS_LEN, choices=STATUS_CHOICES)
    user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=ACCOUNT_TYPE_LEN, choices=TYPE_CHOICES_ACCOUNT)

    def get_last_version(self):
        return AccountHistory.objects.filter(account=self).order_by('-timestamp').first()

    def get_info(self):
        fields = ['first_name', 'last_name', 'surname']
        res = {key : self.get_last_version().__dict__[key] for key in self.get_last_version().__dict__ if key in fields}
        res['role'] = self.role
        res['username'] = self.user.username
        return res

    def get_data_from_history(self):
        data = self.get_last_version().__dict__
        return {key : data[key] for key in data if key in ['first_name', 'last_name', 'surname']}

    class Meta:
        db_table = 'accounts'


class AccountToObject(UUIDMixin, models.Model):
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    object = models.ForeignKey(Object, on_delete=models.PROTECT)
    status = models.CharField(max_length=STATUS_LEN, choices=STATUS_CHOICES)

    class Meta:
        db_table = 'account_to_object'
        unique_together = (('object', 'account', 'status'),)


def is_positive(number: int):
    if number < 0:
        raise ValidationError(f'Version {number} is less then zero')


class ObjectHistory(UUIDMixin, models.Model):
    version = models.IntegerField(default=0, validators=[is_positive])
    name = models.CharField(max_length=DEFAULT_LEN)
    timestamp = models.DateTimeField(auto_now_add=True)
    object = models.ForeignKey(Object, on_delete=models.PROTECT)
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT)
    action = models.CharField(max_length=DEFAULT_ACTION_LEN, choices=HISTORY_CHOICES)

    class Meta:
        db_table = 'objects_history'


class AccountHistory(UUIDMixin, models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='modified')
    first_name = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    last_name = models.CharField(max_length=NAMES_LEN)
    surname = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    action = models.CharField(max_length=ACTION_ACCOUNT_LEN, choices=ACCOUNT_HISTORY_CHOICES)
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='modifier')

    def to_dict(self):
        info = {key: self.__dict__[key] for key in self.__dict__ if key not in ['_state', 'account', 'id']}
        info['id'] = self.account.id
        info['modified_by'] = self.modified_by.user.username
        info['username'] = self.account.user.username
        info['role'] = self.account.role
        return info

    class Meta:
        db_table = 'accounts_history'
