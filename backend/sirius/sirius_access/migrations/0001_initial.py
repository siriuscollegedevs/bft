from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import sirius_access.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('active', 'Активен'), ('outdated', 'Неактивен')], max_length=10)),
                ('role', models.CharField(choices=[('administrator', 'Администратор'), ('manager', 'Руководитель СБ'), ('specialist', 'Специалист СБ'), ('security_officer', 'Сотрудник охраны')], max_length=16)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'accounts',
            },
        ),
        migrations.CreateModel(
            name='Object',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('active', 'Активен'), ('outdated', 'Неактивен')], max_length=10)),
            ],
            options={
                'db_table': 'objects',
            },
        ),
        migrations.CreateModel(
            name='ObjectHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('version', models.IntegerField(default=0, validators=[sirius_access.models.is_positive])),
                ('name', models.CharField(max_length=50)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('action', models.CharField(choices=[('deleted', 'Удален'), ('modified', 'Изменен'), ('created', 'Создан')], max_length=10)),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='sirius_access.account')),
                ('object', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='sirius_access.object')),
            ],
            options={
                'db_table': 'objects_history',
            },
        ),
        migrations.CreateModel(
            name='AccountHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('first_name', models.CharField(blank=True, max_length=20, null=True)),
                ('last_name', models.CharField(max_length=20)),
                ('surname', models.CharField(blank=True, max_length=20, null=True)),
                ('action', models.CharField(choices=[('deleted', 'Удален'), ('modified', 'Изменен'), ('created', 'Создан'), ('password_changed', 'Изменен пароль')], max_length=16)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='modified', to='sirius_access.account')),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='modifier', to='sirius_access.account')),
            ],
            options={
                'db_table': 'accounts_history',
            },
        ),
        migrations.CreateModel(
            name='AccountToObject',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('active', 'Активен'), ('outdated', 'Неактивен')], max_length=10)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='sirius_access.account')),
                ('object', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='sirius_access.object')),
            ],
            options={
                'db_table': 'account_to_object',
                'unique_together': {('object', 'account', 'status')},
            },
        ),
    ]
