from django.db import migrations
from django.db import transaction
from django.contrib.auth.models import User
from ..models import Account, AccountHistory
from os import getenv
from dotenv import load_dotenv

load_dotenv()


class Migration(migrations.Migration):

    dependencies = [
        ('sirius_access', '0001_initial'),
    ]

    def create_default_admin(self, schema_editor):
        with transaction.atomic():
            user = User.objects.create_user(username=getenv('ADMIN_USERNAME'), password=getenv('ADMIN_PASSWORD'))
            account = Account.objects.create(
                user=user,
                status='active',
                role='administrator'
            )
            AccountHistory.objects.create(
                account=account,
                modified_by=account,
                first_name=getenv('ADMIN_INITIALS'),
                last_name=getenv('ADMIN_INITIALS'),
                surname=getenv('ADMIN_INITIALS'),
                action='created'
            )

    operations = [
        migrations.RunPython(create_default_admin)
    ]
