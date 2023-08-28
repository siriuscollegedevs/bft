from django.db import migrations, models
import django.db.models.deletion
import uuid
from django.utils import timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('sirius_access', '0001_initial'),
        ('sirius_access', '0003_generate_account_to_object'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('active', 'Активен'), ('outdated', 'Неактивен')], max_length=10)),
            ],
            options={
                'db_table': 'records',
            },
        ),
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('active', 'Активен'), ('outdated', 'Неактивен')], max_length=10)),
            ],
            options={
                'db_table': 'requests',
            },
        ),
        migrations.CreateModel(
            name='RequestToObject',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sirius_access.object')),
                ('request', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='request_app.request')),
            ],
            options={
                'db_table': 'request_to_object',
            },
        ),
        migrations.CreateModel(
            name='RequestHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField(default=timezone.now)),
                ('code', models.IntegerField(editable=False)),
                ('action', models.CharField(choices=[('deleted', 'Удалена'), ('canceled', 'Аннулирована'), ('outdated', 'Истек срок действия'), ('modified', 'Изменена'), ('created', 'Создана'), ('closed', 'Погашена')], max_length=10)),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='sirius_access.account')),
                ('request', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='request_app.request')),
            ],
            options={
                'db_table': 'request_history',
            },
        ),
        migrations.CreateModel(
            name='RecordHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField(default=timezone.now)),
                ('action', models.CharField(choices=[('deleted', 'Удалена'), ('canceled', 'Аннулирована'), ('outdated', 'Истек срок действия'), ('modified', 'Изменена'), ('created', 'Создана'), ('closed', 'Погашена')], max_length=10)),
                ('car_number', models.CharField(blank=True, max_length=60, null=True, default='')),
                ('car_brand', models.CharField(blank=True, max_length=60, null=True, default='')),
                ('car_model', models.CharField(blank=True, max_length=60, null=True, default='')),
                ('type', models.CharField(choices=[('for_once', 'разовый'), ('for_long_time', 'временный')], max_length=13)),
                ('first_name', models.CharField(blank=True, max_length=60, null=True, default='')),
                ('last_name', models.CharField(blank=True, max_length=60, null=True, default='')),
                ('surname', models.CharField(blank=True, max_length=60, null=True, default='')),
                ('from_date', models.DateField()),
                ('to_date', models.DateField()),
                ('note', models.TextField(blank=True, null=True, default='')),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='sirius_access.account')),
                ('record', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='request_app.record')),
            ],
            options={
                'db_table': 'records_history',
            },
        ),
        migrations.AddField(
            model_name='record',
            name='request',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='request_app.request'),
        ),
    ]
