from django.db import migrations
from django.db import transaction
from django.contrib.auth.models import User
from .config import *
from ..models import Account, AccountHistory, Object, ObjectHistory


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
                        action='modified'
                        **record
                    )
            for object_data in OBJECT_DATA:
                object_inst = Object.objects.create(status='active')
                ObjectHistory.objects.create(object=object_inst, modified_by=account, action='created', **object_data)
                object_inst = Object.objects.create(status='outdated')
                ObjectHistory.objects.create(object=object_inst, modified_by=account, action='created', **object_data)
                object_data['version'] += 1
                ObjectHistory.objects.create(object=object_inst, modified_by=account, action='deleted', **object_data)
                for record in OBJECT_HISTORY:
                    ObjectHistory.objects.create(object=object_inst, modified_by=account, action='modified', **object_data)


    dependencies = [
        ('sirius_access', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(generate_random_data)
    ]
