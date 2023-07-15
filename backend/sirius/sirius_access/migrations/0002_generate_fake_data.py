from django.db import migrations
from django.db import transaction
from django.contrib.auth.models import User
from . .models import Account, AccountHistory, Object, ObjectHistory


class Migration(migrations.Migration):
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
        {'version': 0, 'name': 'Фишт', 'action': 'created'},
        {'version': 0, 'name': 'Арена', 'action': 'created'},
        {'version': 0, 'name': 'Айсберг', 'action': 'created'},
        {'version': 0, 'name': 'Лицей', 'action': 'created'},
        {'version': 0, 'name': 'Образовательный центр', 'action': 'created'},
        {'version': 0, 'name': 'Парк науки и искусства', 'action': 'created'},
    ]

    def generate_random_data(self, schema_editor):

        with transaction.atomic():
            for user_data, account_data in zip(Migration.USER_DATA, Migration.ACCOUNT_DATA):
                user = User.objects.create(**user_data)
                account = Account.objects.create(status='active', user=user)
                AccountHistory.objects.create(account=account, modified_by=account, username=user.username, **account_data)
            for object_data in Migration.OBJECT_DATA:
                object_inst = Object.objects.create(status='active')
                ObjectHistory.objects.create(object=object_inst, modified_by=account, **object_data)


    dependencies = [
        ('sirius_access', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(generate_random_data)
    ]
