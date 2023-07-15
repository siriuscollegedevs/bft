from django.db import models
from sirius.config import *
from .config import *
from sirius_access.models import Account, Object, UUIDMixin


class Request(UUIDMixin, models.Model):
    status = models.CharField(max_length=STATUS_LEN, choices=STATUS_CHOICES)

    def get_last_version(self):
       return RequestHistory.objects.filter(request=self).order_by('-timestamp').first()
    
    def get_info(self):
        """
        Returns:
        {
            'id' : request.id <uuid>
            'timestamp' : time of creation <datetime>
            'code': <str>
        }
        """
        info = {}
        info['id'] = self.id
        info['timestamp'] = self.get_last_version().timestamp
        info['code'] = self.get_last_version().code
        return info
    
    def make_outdated(self, user, action, note=''):
        """
        Args:
            user : Account -- who modified an object
            action : str -- action type

        Keyword arguments:
            note : str -- reason of action

        Returns:
            None
        """
        self.status = 'outdated'
        self.save()
        RequestHistory.objects.create(action=action, modified_by=user, request=self, code=self.get_last_version().code)
        for record in Record.objects.filter(request=self, status='active'):
            record.make_outdated(user=user, action=action, note=note)

    class Meta:
        db_table = 'requests'


class Record(UUIDMixin, models.Model):
    status = models.CharField(max_length=STATUS_LEN, choices=STATUS_CHOICES)
    request = models.ForeignKey(Request, on_delete=models.PROTECT)

    def get_last_version(self):
       return RecordHistory.objects.filter(record=self).order_by('-timestamp').first()

    def get_info(self):
        """
        Returns:
        {
            'id' : record.id <uuid>
            'timestamp' : time of last modification <datetime>
            'code' : <str>
            'action' : action type <str>
            'modified_by' : username of account that changed the data <str>
            'type' : record's type <str>
            'first_name' : <str>
            'last_name' : <str>
            'object' : object name <str>
            'car_number' : <str>
            'car_brand' : <str>
            'car_model': <str>
            'from_date': <datetime>
            'to_date': <datetime>
            'note': <str>
        }
        """
        data = self.get_last_version()
        info = {key : data.__dict__[key] for key in data.__dict__ if key not in ['id', '_state', 'record', 'object_id', 'modified_by_id']}
        info['id'] = self.id
        info['object'] = data.object.get_info().name
        info['modified_by'] = data.modified_by.get_last_version().username
        return info

    def make_outdated(self, user, action, note=''):
        """
        Args:
            user : Account -- who modified an object
            action : str -- action type

        Keyword arguments:
            note : str -- reason of action

        Returns:
            None
        """
        self.status = 'outdated'
        self.save()
        data = self.get_last_version().__dict__
        info = {key : data[key] for key in data if key not in USELESS_FIELDS_FOR_NEW_RECORD_HISTORY}
        RecordHistory.objects.create(action=action, modified_by=user, record=self, note=note, **info)

    class Meta:
        db_table =  'records'


class RecordHistory(UUIDMixin, models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=ACTION_RECORD_LEN, choices=STATUS_CHOICES_RECORD)
    car_number = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    car_brand  = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    car_model = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT)
    record = models.ForeignKey(Record, on_delete=models.PROTECT)
    object = models.ForeignKey(Object, on_delete=models.PROTECT)
    type = models.CharField(max_length=RECORD_TYPE_LEN, choices=TYPE_CHOICES_RECORD)
    first_name = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    last_name = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    surname = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    from_date = models.DateTimeField(null=True, blank=True)
    to_date  = models.DateTimeField()
    note = models.TextField()

    class Meta:
        db_table = 'records_history'

class RequestHistory(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    request = models.ForeignKey(Request, on_delete=models.PROTECT)
    code = models.CharField(max_length=DEFAULT_LEN)
    action = models.CharField(max_length=ACTION_RECORD_LEN, choices=STATUS_CHOICES_RECORD)
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT)

    class Meta:
            db_table =  'request_history'
