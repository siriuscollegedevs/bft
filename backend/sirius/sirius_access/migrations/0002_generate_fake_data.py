from django.db import migrations
from django.db import transaction
from django.contrib.auth.models import User
from ..models import Account, AccountHistory, Object, ObjectHistory
from datetime import datetime, timedelta


USER_DATA = [
        {'username': 'custom', 'password': 'custom'},
        {'username': 'aladin', 'password': 'aladin'},
        {'username': 'userman', 'password': 'userman'},
        {'username': 'user1', 'password': 'user1'},
        {'username': 'someuser', 'password': 'someuser'},
        {'username': 'customuser', 'password': 'customuser'},
        {'username': 'specialuser', 'password': 'specialuser'},
        {'username': 'user2', 'password': 'user2'},
        {'username': 'specialoff', 'password': 'specialoff'},
        {'username': 'objcreator', 'password': 'objcreator'},
        {'username': 'superman', 'password': 'superman'},
        {'username': 'tor', 'password': 'tor'},
        {'username': 'unique', 'password': 'unique'},
        {'username': 'creator', 'password': 'creator'},
        {'username': 'deletor', 'password': 'deletor'},
        {'username': 'user3', 'password': 'user3'},
]

ACCOUNT_DATA = [
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 1, 16)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 2, 20)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 3, 10)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 4, 25)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 6, 7)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 7, 9)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 1, 23)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 2, 7)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 3, 4)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 4, 5)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 5, 14)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 6, 3)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 7, 9)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 8, 1)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 4, 9)},
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created', 'timestamp': datetime(2023, 1, 8)},
]

ACCOUNT_ROLES = [
    {'role': 'manager'},
    {'role': 'specialist'},
    {'role': 'security_officer'},
    {'role': 'administrator'},
] * 4

OBJECT_DATA = [
    {'version': 0, 'name': 'Фишт', 'timestamp': datetime(2023, 1, 16)},
    {'version': 0, 'name': 'Арена', 'timestamp': datetime(2023, 2, 20)},
    {'version': 0, 'name': 'Айсберг', 'timestamp': datetime(2023, 3, 4)},
    {'version': 0, 'name': 'Лицей', 'timestamp': datetime(2023, 5, 14)},
    {'version': 0, 'name': 'Образовательный центр', 'timestamp': datetime(2023, 8, 1)},
    {'version': 0, 'name': 'Парк науки и искусства', 'timestamp': datetime(2023, 1, 8)},
]

ACCOUNT_HISTORY = [
    {'first_name': 'Андрей', 'last_name': 'Иванов', 'surname': 'Иванович'},
    {'first_name': 'Андрей', 'last_name': 'Андреев', 'surname': 'Иванович'},
    {'first_name': 'Андрей', 'last_name': 'Андреев', 'surname': 'Андреевич'},
    {'first_name': 'Илья', 'last_name': 'Андреев', 'surname': 'Константинович'},
    {'first_name': 'Илья', 'last_name': 'Илюшев', 'surname': 'Ильин'},
    {'first_name': 'Игорь', 'last_name': 'Карпов', 'surname': 'Ильин'},
    {'first_name': 'Игорь', 'last_name': 'Карпов', 'surname': 'Игоревич'},
    {'first_name': 'Артём', 'last_name': 'Иванов', 'surname': 'Иванович'},
    {'first_name': 'Артём', 'last_name': 'Андреев', 'surname': 'Романович'},
    {'first_name': 'Артём', 'last_name': 'Мишин', 'surname': 'Андреевич'},
    {'first_name': 'Константин', 'last_name': 'Мишин', 'surname': 'Романович'},
    {'first_name': 'Константин', 'last_name': 'Илюшев', 'surname': 'Ильин'},
    {'first_name': 'Константин', 'last_name': 'Карпов', 'surname': 'Романович'},
    {'first_name': 'Артур', 'last_name': 'Мишин', 'surname': 'Игоревич'},
    {'first_name': 'Артур', 'last_name': 'Карпов', 'surname': 'Романович'},
    {'first_name': 'Артур', 'last_name': 'Карпов', 'surname': 'Константинович'},
]

OBJECT_HISTORY = [
    {'name': 'Арена'},
    {'name': 'Айсберг'},
    {'name': 'Лицей'},
    {'name': 'Образовательный центр'},
    {'name': 'Парк науки и искусства'},
    {'name': 'Фишт'},
]


class Migration(migrations.Migration):

    def generate_random_data(self, schema_editor):

        with transaction.atomic():
            existing_accounts = []
            for user_data, account_data, account_role in zip(USER_DATA, ACCOUNT_DATA, ACCOUNT_ROLES):
                user = User.objects.create_user(**user_data)
                account = Account.objects.create(status='active', user=user, **account_role)
                AccountHistory.objects.create(account=account, modified_by=account, **account_data)
                for index, record in enumerate(ACCOUNT_HISTORY):
                    if (record['first_name'], record['last_name'], record['surname']) not in existing_accounts:
                        AccountHistory.objects.create(
                            account=account,
                            modified_by=account,
                            action='modified',
                            timestamp=account_data['timestamp'] + timedelta(index+1),
                            **record
                        )
                created_account = account.get_data_from_history()
                existing_accounts.append((created_account['first_name'], created_account['last_name'], created_account['surname']))
                ACCOUNT_HISTORY.append(ACCOUNT_HISTORY.pop(0))
            existing_objects = []
            for object_data in OBJECT_DATA:
                object_inst = Object.objects.create(status='active')
                ObjectHistory.objects.create(object=object_inst, modified_by=account, action='created', **object_data)
                vers = 0
                for index, record in enumerate(OBJECT_HISTORY):
                    if record['name'] not in existing_objects:
                        vers += 1
                        ObjectHistory.objects.create(
                            version=vers,
                            object=object_inst,
                            modified_by=account,
                            action='modified',
                            timestamp=object_data['timestamp'] + timedelta(index+1),
                            **record
                        )
                existing_objects.append(object_inst.get_info().name)
                OBJECT_HISTORY.append(OBJECT_HISTORY.pop(0))
                object_inst = Object.objects.create(status='outdated')
                ObjectHistory.objects.create(object=object_inst, modified_by=account, action='created', **object_data)
                object_data['version'] += 1
                ObjectHistory.objects.create(
                    object=object_inst,
                    modified_by=account,
                    action='deleted',
                    version=object_data['version'],
                    name=object_data['name'],
                    timestamp=object_data['timestamp'] + timedelta(1)
                )

    dependencies = [
        ('sirius_access', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(generate_random_data)
    ]
