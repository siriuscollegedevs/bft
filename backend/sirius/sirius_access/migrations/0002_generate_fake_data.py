from django.db import migrations
from django.db import transaction
from django.contrib.auth.models import User
from ..models import Account, AccountHistory, Object, ObjectHistory


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
    {'role': 'manager', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'specialist', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'security_officer', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'administrator', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'manager', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'specialist', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'security_officer', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'administrator', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'manager', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'specialist', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'security_officer', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'administrator', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'manager', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'specialist', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'security_officer', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
    {'role': 'administrator', 'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'},
]

OBJECT_DATA = [
    {'version': 0, 'name': 'Фишт'},
    {'version': 0, 'name': 'Арена'},
    {'version': 0, 'name': 'Айсберг'},
    {'version': 0, 'name': 'Лицей'},
    {'version': 0, 'name': 'Образовательный центр'},
    {'version': 0, 'name': 'Парк науки и искусства'},
]

ACCOUNT_HISTORY = [
    {'first_name': 'Андрей', 'last_name': 'Иванов', 'surname': 'Иванович'},
    {'first_name': 'Андрей', 'last_name': 'Андреев', 'surname': 'Иванович'},
    {'first_name': 'Андрей', 'last_name': 'Андреев', 'surname': 'Андреевич'},
    {'first_name': 'Илья', 'last_name': 'Андреев', 'surname': 'Ильин'},
    {'first_name': 'Илья', 'last_name': 'Илюшев', 'surname': 'Ильин'},
    {'first_name': 'Игорь', 'last_name': 'Карпов', 'surname': 'Ильин'},
    {'first_name': 'Игорь', 'last_name': 'Карпов', 'surname': 'Игоревич'},
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
            for user_data, account_data in zip(USER_DATA, ACCOUNT_DATA):
                user = User.objects.create_user(**user_data)
                account = Account.objects.create(status='active', user=user)
                AccountHistory.objects.create(account=account, modified_by=account, username=user.username, **account_data)
                for record in ACCOUNT_HISTORY:
                    AccountHistory.objects.create(
                        account=account,
                        modified_by=account,
                        username=user.username,
                        role=account_data['role'],
                        action='modified',
                        **record
                    )
                ACCOUNT_HISTORY.append(ACCOUNT_HISTORY.pop(0))
            for object_data in OBJECT_DATA:
                object_inst = Object.objects.create(status='active')
                ObjectHistory.objects.create(object=object_inst, modified_by=account, action='created', **object_data)
                vers = 0
                for record in OBJECT_HISTORY:
                    vers += 1
                    ObjectHistory.objects.create(version=vers, object=object_inst, modified_by=account, action='modified', **record)
                OBJECT_HISTORY.append(OBJECT_HISTORY.pop(0))
                object_inst = Object.objects.create(status='outdated')
                ObjectHistory.objects.create(object=object_inst, modified_by=account, action='created', **object_data)
                object_data['version'] += 1
                ObjectHistory.objects.create(object=object_inst, modified_by=account, action='deleted', **object_data)

    dependencies = [
        ('sirius_access', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(generate_random_data)
    ]
