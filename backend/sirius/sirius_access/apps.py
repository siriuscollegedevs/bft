from django.apps import AppConfig


class SiriusAccessConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sirius_access'

    # def ready(self):
    #     from sirius import operator
    #     operator.start()
