from loguru import logger

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django_apscheduler.jobstores import register_events, DjangoJobStore
from django_apscheduler import util
from django_apscheduler.models import DjangoJobExecution

from django.utils import timezone
from datetime import timedelta
from sirius_access.models import Account, AccountHistory, Object, ObjectHistory, AccountToObject
from request_app.models import Record, Request, RecordHistory, RequestHistory, RequestToObject


# ACCOUNT AND OBJECTS

@util.close_old_connections
def delete_archive_accounts():
    logger.info('Started "delete_archive_accounts"')
    try:
        AccountHistory.objects.filter(timestamp__lte=timezone.now() - timedelta(365)).delete()
    except Exception as error:
        logger.error('Error while deleting accounts history: {error}'.format(error=error))
    try:
        for account in Account.objects.filter(status='outdated'):
            if not (
                AccountHistory.objects.filter(account=account).exists() or
                AccountToObject.objects.filter(account=account).exists()
            ):
                account.delete()
    except Exception as error:
        logger.error('Error while deleting archive accounts: {error}'.format(error=error))

@util.close_old_connections
def delete_archive_objects():
    logger.info('Started "delete_archive_objects"')
    try:
        ObjectHistory.objects.filter(timestamp__lte=timezone.now() - timedelta(365)).delete()
    except Exception as error:
        logger.error('Error while deleting objects history: {error}'.format(error=error))
    try:
        for object_ins in Object.objects.filter(status='outdated'):
            if not (
                ObjectHistory.objects.filter(object=object_ins).exists() or
                AccountToObject.objects.filter(object=object_ins).exists()
            ):
                object_ins.delete()
    except Exception as error:
        logger.error('Error while deleting archive objects: {error}'.format(error=error))

@util.close_old_connections
def delete_archive_account_to_object(logger):
    logger.info('Started "delete_archive_account_to_object"')
    try:
        AccountToObject.objects.filter(status='outdated').delete()
    except Exception as error:
        logger.error('Error while deleting archive account_to_object: {error}'.format(error=error))

# REQUESTS AND RECORDS

@util.close_old_connections
def check_outdated_records():
    try:
        account = Account.objects.filter(role='administrator').first()
    except Exception as ex:
        logger.error('Error while retrieving admin account: {error}'.format(error=ex))
    try:
        for record in Record.objects.filter(status='active'):
            last_record = record.get_last_version()
            if last_record.to_date < timezone.now().date():
                record.make_outdated(account, 'outdated')
    except Exception as ex:
        logger.error('Error while checking outdated records: {error}'.format(error=ex))
    try:
        for request in Request.objects.filter(status='active'):
            if not Record.objects.filter(request=request, status='active').exists():
                request.make_outdated(account, 'outdated')
    except Exception as ex:
        logger.error('Error while checking outdated requests: {error}'.format(error=ex))

@util.close_old_connections
def delete_archive_records():
    # RECORDS
    try:
        RecordHistory.objects.filter(timestamp__lte=timezone.now() - timedelta(30)).delete()
        logger.info('Deleting records history')
    except Exception as ex:
        logger.error('Error while deleting records history: {error}'.format(error=ex))
    try:
        for record in Record.objects.filter(status='outdated'):
            if not RecordHistory.objects.filter(record=record).exists():
                record.delete()
        logger.info('Deleting archive records')
    except Exception as ex:
        logger.error('Error while deleting archive records: {error}'.format(error=ex))

    # REQUESTS
    try:
        RequestHistory.objects.filter(timestamp__lte=timezone.now() - timedelta(30)).delete()
    except Exception as ex:
        logger.error('Error while deleting requests history: {error}'.format(error=ex))
    try:
        for request in Request.objects.filter(status='outdated'):
            if not RequestHistory.objects.filter(request=request).exists():
                RequestToObject.objects.filter(request=request).delete()
                request.delete()
        logger.info('Deleting archive requests')
    except Exception as ex:
        logger.error('Error while deleting archive requests: {error}'.format(error=ex))

@util.close_old_connections
def delete_old_job_executions(max_age=604_800):
  """
  This job deletes APScheduler job execution entries older than `max_age` from the database.
  It helps to prevent the database from filling up with old historical records that are no
  longer useful.

  :param max_age: The maximum length of time to retain historical job execution records.
                  Defaults to 7 days.
  """
  DjangoJobExecution.objects.delete_old_job_executions(max_age)

# STARTING SCHEDULER

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), 'default')
    register_events(scheduler)

    scheduler.add_job(
      check_outdated_records,
      trigger=CronTrigger(hour="00", minute="00"),  # Каждый день в полночь
      id="check_outdated_records",
      max_instances=1,
      replace_existing=True,
    )
    logger.info("Added job 'check_outdated_records'.")

    scheduler.add_job(
      delete_archive_records,
      trigger=CronTrigger(hour="00", minute="00"),  # Каждый день в полночь
      id="delete_archive_records",
      max_instances=1,
      replace_existing=True,
    )
    logger.info("Added job 'delete_archive_records'.")

    scheduler.add_job(
      delete_archive_account_to_object,
      trigger=CronTrigger(
            day_of_week="sun", hour="00", minute="00"
        ),  # Каждое воскресенье в полночь.
      id="delete_archive_account_to_object",
      max_instances=1,
      replace_existing=True,
    )
    logger.info("Added job 'delete_archive_account_to_object'.")

    scheduler.add_job(
      delete_archive_objects,
      trigger=CronTrigger(hour="00", minute="00"),  # Каждый день в полночь
      id="delete_archive_objects",
      max_instances=1,
      replace_existing=True,
    )
    logger.info("Added job 'delete_archive_objects'.")

    scheduler.add_job(
      delete_archive_accounts,
      trigger=CronTrigger(hour="00", minute="00"),  # Каждый день в полночь
      id="delete_archive_accounts",
      max_instances=1,
      replace_existing=True,
    )
    logger.info("Added job 'delete_archive_accounts'.")

    try:
        scheduler.start()
    except KeyboardInterrupt:
        logger.info("Stopping scheduler...")
        scheduler.shutdown()
        logger.info("Scheduler shut down successfully!")
    except Exception as error:
        logger.error('Error while starting scheduler: {error}'.format(error=error))
