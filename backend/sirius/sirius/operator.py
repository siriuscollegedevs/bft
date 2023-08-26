from loguru import logger

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django_apscheduler.jobstores import register_events, DjangoJobStore
from django_apscheduler import util
from django_apscheduler.models import DjangoJobExecution

from sirius_access.views import archive_deletion, print_smth
from request_app.views import check_outdated_records


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), 'default')
    register_events(scheduler)

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

    scheduler.add_job(
      print_smth,
      trigger=CronTrigger(second="*/5"),
      args=(logger,),
      id="print_smth",
      max_instances=1,
      replace_existing=True,
    )
    logger.info("Added job 'print_smth'.")

    scheduler.add_job(
      check_outdated_records,
      trigger=CronTrigger(hour="00", minute="00"),  # Каждый день в полночь
      args=(logger,),
      id="check_outdated_records",
      max_instances=1,
      replace_existing=True,
    )
    logger.info("Added job 'check_outdated_records'.")

    scheduler.add_job(
      archive_deletion,
      trigger=CronTrigger(hour="00", minute="00"),  # Каждый день в полночь
      args=(logger,),
      id="archive_deletion",
      max_instances=1,
      replace_existing=True,
    )
    logger.info("Added job 'archive_deletion'.")

    scheduler.add_job(
        delete_old_job_executions,
        trigger=CronTrigger(
            day_of_week="mon", hour="00", minute="00"
        ),  # Каждый понедельник в полночь.
        id="delete_old_job_executions",
        max_instances=1,
        replace_existing=True,
    )
    logger.info(
        "Added weekly job: 'delete_old_job_executions'."
    )
    scheduler.start()
