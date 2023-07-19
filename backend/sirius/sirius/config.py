STATUS_CHOICES = (('active', 'Активен'), ('outdated', 'Неактивен'))
HISTORY_CHOICES = (('delited', 'Удален'), ('modified',
                   'Изменен'), ('created', 'Создан'))

# MODEL'S FIELDS LEN
DEFAULT_LEN = 50
NAMES_LEN = 20
DEFAULT_ACTION_LEN = 10
STATUS_LEN = 10

USELESS_FIELDS = ['_state', 'id']
FIELDS_TO_ADD =  ['timestamp', 'action', 'modified_by_id']