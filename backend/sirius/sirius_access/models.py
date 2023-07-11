from django.db import models
from uuid import uuid4
from django.core.exceptions import ValidationError
from .config import *
from django.conf.global_settings import AUTH_USER_MODEL


class UUIDMixin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    class Meta:
        abstract = True

class Object(UUIDMixin, models.Model):
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def get_info(self):
            return ObjectHistory.objects.filter(object=self).order_by('-timestamp').first()

    class Meta:
        db_table =  'objects'


class Account(UUIDMixin, models.Model):
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE)

    def get_last_version(self):
        return AccountHistory.objects.filter(account=self).order_by('-timestamp').first()
    
    def get_info(self):
        fields = ['role', 'first_name', 'last_name', 'surname', 'username']
        return {key : self.get_last_version().__dict__[key] for key in self.get_last_version().__dict__ if key in fields}

    class Meta:
        db_table =  'accounts'


class Request(UUIDMixin, models.Model):
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    class Meta:
        db_table = 'requests'


class Record(UUIDMixin, models.Model):
    request = models.ForeignKey(Request, on_delete=models.PROTECT)

    class Meta:
        db_table =  'records'


class AccountToObject(UUIDMixin, models.Model):
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    object = models.ForeignKey(Object, on_delete=models.PROTECT)

    class Meta:
        db_table = 'account_to_object'
        unique_together = (('object', 'account'),)


def is_positive(number: int):
    if number < 0:
        raise ValidationError(f'Version {number} is less then zero')


class ObjectHistory(UUIDMixin, models.Model):
    version = models.IntegerField(default=0, validators=[is_positive])
    name = models.CharField(max_length=DEFAULT_LEN)
    timestamp = models.DateTimeField(auto_now_add=True)
    object = models.ForeignKey(Object, on_delete=models.PROTECT)
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT)
    action = models.CharField(max_length=CHOICE_FIELD_LEN, choices=HISTORY_CHOICES)

    class Meta:
        db_table = 'objects_history'


class RecordHistory(UUIDMixin, models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=CHOICE_FIELD_LEN, choices=ACTION_CHOICES_RECORD)
    car_number = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    car_brand  = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    car_model = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT)
    record = models.ForeignKey(Record, on_delete=models.PROTECT)
    object = models.ForeignKey(Object, on_delete=models.PROTECT)
    type = models.CharField(max_length=13, choices=TYPE_CHOICES_RECORD)
    first_name = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    last_name = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    surname = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    from_date = models.DateTimeField(null=True, blank=True)
    to_date  = models.DateTimeField()
    note = models.TextField()

    class Meta:
        db_table = 'records_history'


class AccountHistory(UUIDMixin, models.Model):
    user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=CHOICE_FIELD_LEN, choices=TYPE_CHOICES_ACCOUNT)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='modified')
    first_name = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    last_name = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    surname = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    position = models.CharField(max_length=NAMES_LEN)
    action = models.CharField(max_length=CHOICE_FIELD_LEN, choices=ACCOUNT_HISTORY_CHOICES)
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='modifier')
    username = models.CharField(max_length=DEFAULT_LEN)

    def to_dict(self):
        info = {key : self.__dict__[key] for key in self.__dict__ if key not in ['_state', 'account', 'id']}
        info['id'] = self.account.id
        info['modified_by'] = self.modified_by.user.username
        info['username'] = self.account.user.username
        return info

    class Meta:
        db_table = 'accounts_history'
