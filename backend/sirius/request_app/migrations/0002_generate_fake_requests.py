from django.db import migrations
from ..models import Request, Record, RequestHistory, RecordHistory, RequestToObject
from ..views import Object, Account
from django.db import transaction
from datetime import datetime


REQUESTS = [
    {'code': '123'}, {'code': '467'}, {'code': '398'}, {'code': '183'},
    {'code': '491'}, {'code': '491'}, {'code': '742'}, {'code': '901'},
    {'code': '482'}, {'code': '100'}, {'code': '396'}, {'code': '763'},
    {'code': '908'}, {'code': '233'}, {'code': '322'}, {'code': '122'},
    {'code': '111'}, {'code': '222'}, {'code': '444'}, {'code': '555'},
    {'code': '300'}, {'code': '200'}, {'code': '400'}, {'code': '500'},
    {'code': '600'}, {'code': '700'}, {'code': '800'}, {'code': '900'},
    {'code': '902'}, {'code': '801'}, {'code': '701'}, {'code': '601'},
    {'code': '501'}, {'code': '401'}, {'code': '301'}, {'code': '201'},
]

CAR_RECORDS = [
    {'car_number': 'В642УР23', 'car_brand': 'Hyundai', 'car_model': 'Solaris', 'type': 'for_once', 'to_date': datetime(2023, 9, 10)},
] * 10

CAR_RECORDS_HISTORY = [
    {'car_number': 'О997МХ23', 'car_brand': 'Kia', 'car_model': 'Sorento', 'type': 'for_once', 'to_date': datetime(2023, 9, 10)},
    {'car_number': 'В437ОН123', 'car_brand': 'Geely', 'car_model': 'Coolray', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 11), 'to_date': datetime(2023, 9, 20)},
    {'car_number': 'А359АН23', 'car_brand': 'Exeed', 'car_model': 'LX', 'type': 'for_once', 'to_date': datetime(2023, 9, 12)},
    {'car_number': 'М509ХР23', 'car_brand': 'Porsche', 'car_model': 'Cayenne', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 12), 'to_date': datetime(2023, 9, 20)},
    {'car_number': 'Е789ЕЕ123', 'car_brand': 'Chery', 'car_model': 'Tiggo', 'type': 'for_once', 'to_date': datetime(2023, 9, 15)},
    {'car_number': 'А083НУ23', 'car_brand': 'Geely', 'car_model': 'Coolray', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 15), 'to_date': datetime(2023, 9, 23)},
    {'car_number': 'А359АН123', 'car_brand': 'Cadillac', 'car_model': 'Escalade', 'type': 'for_once', 'to_date': datetime(2023, 9, 13)},
    {'car_number': 'М809МС23', 'car_brand': 'Chevrolet', 'car_model': 'Tahoe', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 11), 'to_date': datetime(2023, 9, 13)},
    {'car_number': 'Р534НА123', 'car_brand': 'Chevrolet', 'car_model': 'Captiva', 'type': 'for_once', 'to_date': datetime(2023, 9, 12)},
    {'car_number': 'К215ВВ23', 'car_brand': 'Ford', 'car_model': 'Focus', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 15), 'to_date': datetime(2023, 9, 20)},
]

HUMAN_RECORDS = [
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'type': 'for_once', 'to_date': datetime(2023, 9, 10)}
] * 10

HUMAN_RECORDS_HISTORY = [
    {'first_name': 'Андрей', 'last_name': 'Семенов', 'surname': 'Николаевич', 'type': 'for_once', 'to_date': datetime(2023, 9, 10)},
    {'first_name': 'Николай', 'last_name': 'Иванов', 'surname': 'Григорьевич', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 11), 'to_date': datetime(2023, 9, 20)},
    {'first_name': 'Арсений', 'last_name': 'Кутузов', 'surname': 'Иванович', 'type': 'for_once', 'to_date': datetime(2023, 9, 12)},
    {'first_name': 'Фёдор', 'last_name': 'Баранов', 'surname': 'Глебович', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 12), 'to_date': datetime(2023, 9, 20)},
    {'first_name': 'Татьяна', 'last_name': 'Куликова ', 'surname': 'Григорьевна', 'type': 'for_once', 'to_date': datetime(2023, 9, 15)},
    {'first_name': 'Иван', 'last_name': 'Капустин', 'surname': 'Маркович', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 15), 'to_date': datetime(2023, 9, 23)},
    {'first_name': 'Владимир', 'last_name': 'Лобанов', 'surname': 'Иванович', 'type': 'for_once', 'to_date': datetime(2023, 9, 13)},
    {'first_name': 'Александр', 'last_name': 'Уткин', 'surname': 'Даниилович', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 11), 'to_date': datetime(2023, 9, 13)},
    {'first_name': 'Виктория', 'last_name': 'Ефимова', 'surname': 'Ивановна', 'type': 'for_once', 'to_date': datetime(2023, 9, 12)},
    {'first_name': 'Алексей', 'last_name': 'Сальников', 'surname': 'Вячеславович', 'type': 'for_long_time', 'from_date': datetime(2023, 9, 15), 'to_date': datetime(2023, 9, 20)},
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
                count_all_objects = Object.objects.filter(status='active').count()
                for object_ins in Object.objects.filter(status='active'):
                    if len(existing_request_object) == count_all_objects:
                        existing_request_object = []
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
