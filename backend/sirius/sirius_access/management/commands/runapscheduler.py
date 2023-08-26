# from loguru import logger

# from django.conf import settings

# from apscheduler.schedulers.background import BackgroundScheduler
# from apscheduler.triggers.cron import CronTrigger
# from django.core.management.base import BaseCommand
# from django_apscheduler.jobstores import DjangoJobStore
# from django_apscheduler.models import DjangoJobExecution
# from django_apscheduler import util

# from ...models import Account, AccountHistory, Object, ObjectHistory

# from datetime import timedelta
# from django.utils import timezone



# @util.close_old_connections
# def archive_deletion():
#   # DELETING ACCOUNTS
#   try:
#     AccountHistory.objects.filter(account__status='active', timestamp__lte=timezone.now() - timedelta(365)).delete()
#   except Exception as error:
#     logger.error('Error while deleting active accounts history: %s', error)
#   try:
#     for account in Account.objects.filter(status='outdated'):
#       if not AccountHistory.objects.filter(account=account).exists():
#         account.delete()
#   except Exception as error:
#     logger.error('Error while deleting archive accounts: %s', error)

#   # DELETING OBJECTS
#   try:
#     ObjectHistory.objects.filter(object__status='active', timestamp__lte=timezone.now() - timedelta(365)).delete()
#   except Exception as error:
#     logger.error('Error while deleting active objects history: %s', error)
#   try:
#     for object_ins in Object.objects.filter(status='outdated'):
#       if not ObjectHistory.objects.filter(object=object_ins).exists():
#         object_ins.delete()
#   except Exception as error:
#     logger.error('Error while deleting archive objects: %s', error)


# def print_smth():
#   logger.info("---------------------")
  



# # The `close_old_connections` decorator ensures that database connections, that have become
# # unusable or are obsolete, are closed before and after your job has run. You should use it
# # to wrap any jobs that you schedule that access the Django database in any way. 
# @util.close_old_connections
# def delete_old_job_executions(max_age=604_800):
#   """
#   This job deletes APScheduler job execution entries older than `max_age` from the database.
#   It helps to prevent the database from filling up with old historical records that are no
#   longer useful.
  
#   :param max_age: The maximum length of time to retain historical job execution records.
#                   Defaults to 7 days.
#   """
#   DjangoJobExecution.objects.delete_old_job_executions(max_age)


# class Command(BaseCommand):
#   help = "Runs APScheduler."

#   def handle(self, *args, **options):
#     scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE)
#     scheduler.add_jobstore(DjangoJobStore(), "default")

#     scheduler.add_job(
#       func=print_smth,
#       trigger=CronTrigger(second="*/3"),
#       id="print_smth",
#       max_instances=1,
#       replace_existing=True,
#     )
#     logger.info("Added job 'print_smth'.")

#     scheduler.add_job(
#       archive_deletion,
#       trigger=CronTrigger(hour="00", minute="00"),  # Каждый день в полночь.
#       id="my_job",
#       max_instances=1,
#       replace_existing=True,
#     )
#     logger.info("Added job 'archive_deletion'.")

#     scheduler.add_job(
#       delete_old_job_executions,
#       trigger=CronTrigger(
#         day_of_week="mon", hour="00", minute="00"
#       ),  # Каждый понедельник в полночь.
#       id="delete_old_job_executions",
#       max_instances=1,
#       replace_existing=True,
#     )
#     logger.info(
#       "Added weekly job: 'delete_old_job_executions'."
#     )

#     try:
#       logger.info("Starting scheduler...")
#       scheduler.start()
#     except KeyboardInterrupt:
#       logger.info("Stopping scheduler...")
#       scheduler.shutdown()
#       logger.info("Scheduler shut down successfully!")
#     except Exception as e:
#       logger.error(e)
