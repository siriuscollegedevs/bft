from django.db import models
from sirius.config import *
from .config import *
from sirius_access.models import Account, Object, UUIDMixin
from datetime import date
from django.core.exceptions import ValidationError


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
            'object' : <str>
        }
        """
        info = {}
        info['id'] = self.id
        info['timestamp'] = self.get_last_version().timestamp
        info['code'] = self.get_last_version().code
        info['object_ids'] = self.get_objects()
        return info

    def get_objects(self):
        return [line.object.id for line in RequestToObject.objects.filter(request=self)]

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
            'type' : record's type <str>
            'first_name' : <str>
            'last_name' : <str>
            'surname' : <str>
            'car_number' : <str>
            'car_brand' : <str>
            'car_model': <str>
            'from_date': <datetime>
            'to_date': <datetime>
            'note': <str>
        }
        """
        data = self.get_last_version()
        info = {key: data.__dict__[key] for key in data.__dict__ if key not in [
            'id', '_state', 'record', 'modified_by_id']}
        info['id'] = self.id
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
        info = {key: data[key] for key in data if key not in USELESS_FIELDS_FOR_NEW_RECORD_HISTORY}
        RecordHistory.objects.create(action=action, modified_by=user, record=self, note=note, **info)

    class Meta:
        db_table = 'records'


class RecordHistory(UUIDMixin, models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=ACTION_RECORD_LEN, choices=STATUS_CHOICES_RECORD)
    car_number = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    car_brand = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    car_model = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT)
    record = models.ForeignKey(Record, on_delete=models.PROTECT)
    type = models.CharField(max_length=RECORD_TYPE_LEN, choices=TYPE_CHOICES_RECORD)
    first_name = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    last_name = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    surname = models.CharField(max_length=NAMES_LEN, null=True, blank=True)
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()
    note = models.TextField(null=True, blank=True)

    def clean_from_date(self):
        from_date = self.cleaned_data.get('from_date')
        if from_date < date.today():
            raise ValidationError('Дата начала действия заявки не может быть меньше текущей даты.')
    
    def clean_to_date(self):
        to_date = self.cleaned_data.get('to_date')
        if to_date < date.today():
            raise ValidationError('Дата конца действия заявки не может быть меньше текущей даты.')
    
    def clean(self):
        super().clean()
        if self.to_date < self.from_date:
            raise ValidationError('Дата начала действия заявки не может быть меньше даты окончания её действия.')

    def get_info(self):
        info = self.__dict__
        info['modified_by'] = self.modified_by.user.username
        return info

    class Meta:
        db_table = 'records_history'


class RequestHistory(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    request = models.ForeignKey(Request, on_delete=models.PROTECT)
    code = models.CharField(max_length=DEFAULT_LEN)
    action = models.CharField(max_length=ACTION_RECORD_LEN, choices=STATUS_CHOICES_RECORD)
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT)

    class Meta:
        db_table = 'request_history'


class RequestToObject(UUIDMixin, models.Model):
    object = models.ForeignKey(Object, models.CASCADE)
    request = models.ForeignKey(Request, models.CASCADE)

    class Meta:
        db_table = 'request_to_object'
