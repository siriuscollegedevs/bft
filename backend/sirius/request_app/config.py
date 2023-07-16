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

# MODEL'S FIELDS LEN
RECORD_TYPE_LEN = 13
ACTION_RECORD_LEN = 10

RECORD_TYPES = ('for_once', 'for_long_time')

USELESS_FIELDS_FOR_NEW_RECORD_HISTORY = ['id', '_state', 'action', 'timestamp', 'modified_by', 'record', 'note']

RECORD_API_STATUSES = ('canceled', 'closed')

# RESPONSE MESSAGES
REQUESTID_ERROR_MSG =  {'error' : 'Invalid RequestId'}
RECORDID_ERROR_MSG = {'error' : 'Invalid RequestdId'}

# SERIALIZER FIELDS SETS
REQUEST_GET_FIELDS = [ "id", "car_number", "car_brand", "car_model", "object",
    "type", "first_name", "surname", "last_name", "from_date", "to_date", "note"]