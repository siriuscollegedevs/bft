from django.db import migrations
from django.contrib.auth.models import User
from ..models import Account, AccountHistory
from django.db import transaction


USER_DATA = [
        {'username': 'fibre', 'password': 'fibre'},
        {'username': 'tin', 'password': 'tin'},
        {'username': 'promise', 'password': 'promise'},
        {'username': 'margin', 'password': 'margin'},
        {'username': 'union', 'password': 'union'},
        {'username': 'miscarriage', 'password': 'miscarriage'},
        {'username': 'tissue', 'password': 'tissue'},
        {'username': 'receipt', 'password': 'receipt'},
        {'username': 'button', 'password': 'button'},
        {'username': 'aviation', 'password': 'aviation'},
        {'username': 'mention', 'password': 'mention'},
        {'username': 'arrest', 'password': 'arrest'},
        {'username': 'wrestle', 'password': 'wrestle'},
        {'username': 'sweet', 'password': 'sweet'},
        {'username': 'direct', 'password': 'direct'},
        {'username': 'find', 'password': 'find'},
]

ACCOUNT_DATA = [
    {'first_name': 'Иван', 'last_name': 'Иванов', 'surname': 'Иванович', 'action': 'created'}
] * 16

ACCOUNT_ROLES = [
    {'role': 'manager'},
    {'role': 'specialist'},
    {'role': 'security_officer'},
    {'role': 'administrator'},
] * 4

ACCOUNT_HISTORY = [
    {'first_name': 'Лев', 'last_name': 'Миронов', 'surname': 'Артёмович'},
    {'first_name': 'Виктория', 'last_name': 'Горячева', 'surname': 'Александровна'},
    {'first_name': 'Матвей', 'last_name': 'Степанов', 'surname': 'Сергеевич'},
    {'first_name': 'Алина', 'last_name': 'Губанова', 'surname': 'Андреевна'},
    {'first_name': 'Лев', 'last_name': 'Косарев', 'surname': 'Егорович'},
    {'first_name': 'Егор', 'last_name': 'Орлов', 'surname': 'Маркович'},
    {'first_name': 'Василий', 'last_name': 'Дементьев', 'surname': 'Ильич'},
    {'first_name': 'Роман', 'last_name': 'Семенов', 'surname': 'Всеволодович'},
    {'first_name': 'Роман', 'last_name': 'Андреев', 'surname': 'Романович'},
    {'first_name': 'Артём', 'last_name': 'Мишин', 'surname': 'Андреевич'},
    {'first_name': 'Матвей', 'last_name': 'Мишин', 'surname': 'Артёмович'},
    {'first_name': 'Константин', 'last_name': 'Илюшев', 'surname': 'Артёмович'},
    {'first_name': 'Константин', 'last_name': 'Карпов', 'surname': 'Романович'},
    {'first_name': 'Егор', 'last_name': 'Косарев', 'surname': 'Игоревич'},
    {'first_name': 'Артур', 'last_name': 'Дементьев', 'surname': 'Сергеевич'},
    {'first_name': 'Василий', 'last_name': 'Степанов', 'surname': 'Ильич'},
]


class Migration(migrations.Migration):

    def archive_accounts(self, schema_editor):
        with transaction.atomic():
            admin = Account.objects.filter(role='administrator', status='active').first()
            existing_accounts = []
            for user_data, account_data, account_role in zip(USER_DATA, ACCOUNT_DATA, ACCOUNT_ROLES):
                user = User.objects.create_user(**user_data)
                account = Account.objects.create(status='active', user=user, **account_role)
                AccountHistory.objects.create(account=account, modified_by=admin, **account_data)
                for iter, record in enumerate(ACCOUNT_HISTORY):
                    if (record['first_name'], record['last_name'], record['surname']) not in existing_accounts:
                        AccountHistory.objects.create(
                            account=account,
                            modified_by=admin,
                            action='modified',
                            **record
                        )
                        if iter == len(ACCOUNT_HISTORY) - 1:
                            AccountHistory.objects.create(
                            account=account,
                            modified_by=admin,
                            action='deleted',
                            **record
                            )
                            account.status = 'outdated'
                            account.save()
                created_account = account.get_data_from_history()
                existing_accounts.append((created_account['first_name'], created_account['last_name'], created_account['surname']))
                ACCOUNT_HISTORY.append(ACCOUNT_HISTORY.pop(0))

    dependencies = [
        ('sirius_access', '0003_generate_account_to_object'),
    ]

    operations = [
        migrations.RunPython(archive_accounts)
    ]
