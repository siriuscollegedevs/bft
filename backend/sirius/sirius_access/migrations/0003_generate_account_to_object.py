from django.db import migrations
from ..models import Account, Object, AccountToObject


class Migration(migrations.Migration):

    def generate_account_to_object(self, schema_editor):
        for account in Account.objects.filter(status='active'):
            for object in Object.objects.filter(status='active'):
                if account.role != 'administrator':
                    if not AccountToObject.objects.filter(account=account, status='outdated').exists():
                        AccountToObject.objects.create(account=account, object=object, status='outdated')
                        continue
                if account.role == 'security_officer':
                    if AccountToObject.objects.filter(
                        account__role='security_officer',
                        object=object,
                        status='active'
                        ).exists():
                        continue
                    else:
                        AccountToObject.objects.create(account=account, object=object, status='active')
                        break
                AccountToObject.objects.create(account=account, object=object, status='active')

    dependencies = [
        ('sirius_access', '0002_generate_fake_data'),
    ]

    operations = [
        migrations.RunPython(generate_account_to_object)
    ]
