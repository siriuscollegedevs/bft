from django.db import models
from sirius_access.config import *
from .config import STATUS_CHOICES_RECORD, TYPE_CHOICES_RECORD
from sirius_access.models import Account, Object, UUIDMixin


class Request(UUIDMixin, models.Model):
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def get_last_version(self):
       return RequestHistory.objects.filter(request=self).order_by('-timestamp').first()
    
    def get_info(self):
        info = {}
        info['id'] = self.id
        info['timestamp'] = self.get_last_version().timestamp
        info['code'] = self.get_last_version().code
        return info

    class Meta:
        db_table = 'requests'


class Record(UUIDMixin, models.Model):
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    request = models.ForeignKey(Request, on_delete=models.PROTECT)

    def get_last_version(self):
       return RecordHistory.objects.filter(record=self).order_by('-timestamp').first()

    class Meta:
        db_table =  'records'


class RecordHistory(UUIDMixin, models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=20, choices=STATUS_CHOICES_RECORD)
    car_number = models.CharField(max_length=20, null=True, blank=True)
    car_brand  = models.CharField(max_length=20, null=True, blank=True)
    car_model = models.CharField(max_length=20, null=True, blank=True)
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT)
    record = models.ForeignKey(Record, on_delete=models.PROTECT)
    object = models.ForeignKey(Object, on_delete=models.PROTECT)
    type = models.CharField(max_length=13, choices=TYPE_CHOICES_RECORD)
    first_name = models.CharField(max_length=20, null=True, blank=True)
    last_name = models.CharField(max_length=20, null=True, blank=True)
    surname = models.CharField(max_length=20, null=True, blank=True)
    from_date = models.DateTimeField(null=True, blank=True)
    to_date  = models.DateTimeField()
    note = models.TextField()

    class Meta:
        db_table = 'records_history'

class RequestHistory(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    request = models.ForeignKey(Request, on_delete=models.PROTECT)
    code = models.CharField(max_length=50)
    action = models.CharField(max_length=16, choices=STATUS_CHOICES_RECORD)

    class Meta:
            db_table =  'request_history'
