STATUS_CHOICES_RECORD = (
    ('deleted', 'Удалена'),
    ('canceled', 'Аннулирована'),
    ('outdated', 'Истек срок действия'),
    ('modified', 'Изменена'),
    ('created', 'Создана'),
    ('closed', 'Погашена')
)
TYPE_CHOICES_RECORD = (
    ('for_once', 'разовый'),
    ('for_long_time', 'временный')
)

RECORD_TYPE_LEN = 13
ACTION_RECORD_LEN = 10

RECORD_TYPES = ('for_once', 'for_long_time')

USELESS_FIELDS_FOR_NEW_RECORD_HISTORY = ['id', '_state', 'action', 'timestamp', 'modified_by', 'record', 'note']

RECORD_API_STATUSES = ('canceled', 'closed')