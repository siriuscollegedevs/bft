from django.db import migrations
from django.db import transaction
from django.contrib.auth.models import User
from ..models import Account, AccountHistory


class Migration(migrations.Migration):

    dependencies = [
        ('sirius_access', '0001_initial'),
    ]

    def create_default_admin(self, schema_editor):
        with transaction.atomic():
            user = User.objects.create_user(username='admin', password='admin')
            account = Account.objects.create(
                user=user,
                status='active',
                role='administrator'
            )
            AccountHistory.objects.create(
                account=account,
                modified_by=account,
                last_name='Админ',
                action='created'
            )

    operations = [
        migrations.RunPython(create_default_admin)
    ]
