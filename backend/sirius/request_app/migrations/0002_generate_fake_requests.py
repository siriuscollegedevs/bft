from django.db import migrations
from ..models import Request, Record, RequestHistory, RecordHistory, RequestToObject
from ..views import Object, Account
from django.db import transaction
from datetime import datetime


REQUESTS = [
    {'code': '123'},
    {'code': '467'},
    {'code': '398'}
]

CAR_RECORDS = [
    {'car_number': 'В642УР23', 'car_brand': 'Hyundai', 'car_model': 'Solaris', 'type': 'for_once', 'to_date': datetime(2023, 9, 10)},
] * 3

CAR_RECORDS_HISTORY = [
    {'car_number': 'О997МХ23', 'car_brand': 'Kia', 'car_model': 'Sorento', 'type': 'for_once', 'to_date': datetime(2023, 9, 10)},
    {'car_number': 'В437ОН123', 'car_brand': 'Geely', 'car_model': 'Coolray', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 11), 'to_date': datetime(2023, 9, 20)},
    {'car_number': 'А359АН23', 'car_brand': 'Exeed', 'car_model': 'LX', 'type': 'for_once', 'to_date': datetime(2023, 9, 12)},
]

HUMAN_RECORDS = [
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'type': 'for_once', 'to_date': datetime(2023, 9, 10)}
] * 3

HUMAN_RECORDS_HISTORY = [
    {'first_name': 'Андрей', 'last_name': 'Семенов', 'surname': 'Николаевич', 'type': 'for_once', 'to_date': datetime(2023, 9, 10)},
    {'first_name': 'Николай', 'last_name': 'Иванов', 'surname': 'Григорьевич', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 11), 'to_date': datetime(2023, 9, 20)},
    {'first_name': 'Арсений', 'last_name': 'Кутузов', 'surname': 'Иванович', 'type': 'for_once', 'to_date': datetime(2023, 9, 12)}
]


class Migration(migrations.Migration):

    def generate_fake_requests(self, schema_editor):
        with transaction.atomic():
            existing_request_object = []
            account = Account.objects.filter(status='active', role='specialist').first()
            for request_info in REQUESTS:
                request = Request.objects.create(status='active')
                RequestHistory.objects.create(
                    request=request,
                    action='created',
                    modified_by=account,
                    code=request_info['code']
                )
                request_object_count = 0
                for object_ins in Object.objects.filter(status='active'):
                    if request_object_count == 2:
                        break
                    if object_ins.id not in existing_request_object:
                        RequestToObject.objects.create(request=request, object=object_ins)
                        existing_request_object.append(object_ins.id)
                        request_object_count += 1
                exisiting_cars = []
                existing_humen = []
                for car_info, human_info in list(zip(CAR_RECORDS, HUMAN_RECORDS)):
                    # CAR RECORD CREATION
                    car_record = Record.objects.create(status='active', request=request)
                    RecordHistory.objects.create(
                        action='created',
                        modified_by=account,
                        record=car_record,
                        **car_info
                    )
                    for car_history in CAR_RECORDS_HISTORY:
                        if car_history['car_number'] not in exisiting_cars:
                            RecordHistory.objects.create(
                            action='modified',
                            modified_by=account,
                            record=car_record,
                            **car_history
                            )
                    exisiting_cars.append(car_record.get_last_version().car_number)
                    # HUMAN RECORD CREATION
                    human_record = Record.objects.create(status='active', request=request)
                    RecordHistory.objects.create(
                        action='created',
                        modified_by=account,
                        record=human_record,
                        **human_info
                    )
                    for human_history in HUMAN_RECORDS_HISTORY:
                        if (human_history['first_name'], human_history['last_name'], human_history['surname']) not in existing_humen:
                            RecordHistory.objects.create(
                            action='modified',
                            modified_by=account,
                            record=human_record,
                            **human_history
                            )
                    existing_humen.append((human_history['first_name'], human_history['last_name'], human_history['surname']))


    dependencies = [
        ('request_app', '0001_initial'),
        ('sirius_access', '0003_generate_account_to_object'),
    ]

    operations = [
        migrations.RunPython(generate_fake_requests)
    ]
