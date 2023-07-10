from django.db import models
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
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, verbose_name='статус')

    def get_info(self):
            return ObjectHistory.objects.filter(object=self).order_by('-timestamp').first()

    class Meta:
        verbose_name = 'Объект Фонда'
        verbose_name_plural = 'Объекты Фонда'
        db_table =  'objects'


class Account(UUIDMixin, models.Model):
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, verbose_name='статус')

    class Meta:
        verbose_name = 'Аккаунт'
        verbose_name_plural = 'Аккаунты'
        db_table =  'accounts'

    def __str__(self):
        for acc in AccountHistory.objects.filter(account=self).order_by('-timestamp'):
            return acc.user.username


class Request(UUIDMixin, models.Model):
    status = models.CharField(max_length=10, choices=STATUS_CHOICES_REQUEST, verbose_name='статус')

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        db_table = 'requests'


class Record(UUIDMixin, models.Model):
    request = models.ForeignKey(Request, on_delete=models.PROTECT)

    class Meta:
        verbose_name = 'Запись'
        verbose_name_plural = 'Записи'
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


class ObjectHistory( UUIDMixin, models.Model):
    version = models.IntegerField(default=0, validators=[is_positive], verbose_name='Версия')
    name = models.CharField(max_length=40, verbose_name='Название')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Действие совершено')
    object = models.ForeignKey(Object, on_delete=models.PROTECT, verbose_name='Объект Фонда')
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT, verbose_name='Изменен пользователем')
    action = models.CharField(max_length=10, choices=HISTORY_CHOICES, verbose_name='Совершенное действие')

    class Meta:
        db_table = 'objects_history'


class RecordHistory(UUIDMixin, models.Model):
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Действие совершено')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES_RECORD, verbose_name='статус')
    car_number = models.CharField(max_length=20, null=True, blank=True, verbose_name='Автомобильный номер')
    car_brand  = models.CharField(max_length=20, null=True, blank=True, verbose_name='Марка')
    car_model = models.CharField(max_length=20, null=True, blank=True, verbose_name='Модель')
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT, verbose_name='Изменен пользователем')
    record = models.ForeignKey(Record, on_delete=models.PROTECT, verbose_name='Запись')
    object = models.ForeignKey(Object, on_delete=models.PROTECT, verbose_name='Объект')
    type = models.CharField(max_length=13, choices=TYPE_CHOICES_RECORD, verbose_name='Тип заявки')
    first_name = models.CharField(max_length=20, null=True, blank=True, verbose_name='Имя')
    last_name = models.CharField(max_length=20, null=True, blank=True, verbose_name='Фамилия')
    surname = models.CharField(max_length=20, null=True, blank=True, verbose_name='Отчество')
    from_date = models.DateTimeField(null=True, blank=True, verbose_name='с')
    to_date  = models.DateTimeField(verbose_name='по')
    note = models.TextField(verbose_name='Примечание')

    class Meta:
        db_table = 'records_history'


class AccountHistory(UUIDMixin, models.Model):
    user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Действие совершено')
    type = models.CharField(max_length=16, choices=TYPE_CHOICES_ACCOUNT, verbose_name='Тип аккаунта')
    account = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='Аккаунт', related_name='modified')
    first_name = models.CharField(max_length=20, null=True, blank=True, verbose_name='Имя')
    last_name = models.CharField(max_length=20, null=True, blank=True, verbose_name='Фамилия')
    surname = models.CharField(max_length=20, null=True, blank=True, verbose_name='Отчество')
    position = models.CharField(max_length=20, verbose_name='Должность')
    action = models.CharField(max_length=10, choices=HISTORY_CHOICES, verbose_name='Совершенное действие')
    modified_by = models.ForeignKey(Account, on_delete=models.PROTECT, verbose_name='Изменен пользователем', related_name='modifier')

    class Meta:
        db_table = 'accounts_history'
