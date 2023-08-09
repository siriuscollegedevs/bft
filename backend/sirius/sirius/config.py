STATUS_CHOICES = (('active', 'Активен'), ('outdated', 'Неактивен'))
HISTORY_CHOICES = (
    ('deleted', 'Удален'),
    ('modified', 'Изменен'),
    ('created', 'Создан')
)

# MODEL'S FIELDS LEN
DEFAULT_LEN = 50
NAMES_LEN = 20
DEFAULT_ACTION_LEN = 10
STATUS_LEN = 10

USELESS_FIELDS = ['_state', 'id']
FIELDS_TO_ADD =  ['timestamp', 'action', 'modified_by_id']

# ERROR MESSAGES
DB_ERROR = error = {"error": "Ошибка базы данных"}
NO_DATA_FOUND_ERROR = {"error": "Данные не найдены"}
