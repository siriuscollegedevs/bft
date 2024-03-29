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
REQUESTID_ERROR_MSG = {'error': 'Invalid RequestId'}
RECORDID_ERROR_MSG = {'error': 'Invalid RequestdId'}

NO_RECORDS_FOUND_ERROR = {"error": "Записи не найдены"}
NO_SEARCH_RECORDS_FOUND_ERROR = {"error": "Записи по запросу не найдены"}
NO_OBJECTS_GIVEN_ERROR = {'error': 'Не предоставлены объекты для закрепления'}

# SERIALIZER FIELDS SETS
RECORD_GENERAL_FIELDS = ["car_number", "car_brand", "car_model",
                         "type", "first_name", "surname", "last_name", "from_date", "to_date", "note"]
REQUEST_GET_FIELDS = RECORD_GENERAL_FIELDS + ["id"]
GET_RECORD_HISTORY_FIELDS = RECORD_GENERAL_FIELDS + ["action", "timestamp", "modified_by"]

# EXPAND SEARCH KEYS
HUMAN_RECORD_KEYS = ('first_name', 'last_name', 'surname')
CAR_RECORD_KEYS = ('car_number', 'car_brand', 'car_model')
GENERAL_RECORD_KEYS = ('type', 'from_date', 'to_date', 'note', 'objects')

# EXCEL_PARSING
LAST_NAME_FIELD_LETTER = "B"
SURNAME_FIELD_LETTER = "D"
FIRST_NAME_FIELD_LETTER = "C"

TO_DATE_CELL = "E5"
FROM_DATE_CELL = "E4"

CAR_BRAND_FIELD_LETTER = "B"
CAR_NOTE_FIELD_LETTER = "H"
CAR_NUMBER_FIELD_LETTER = "E"

START = '12'
START_OF_CAR_RECORDS = 'Список автотранспортных средств'
END_OF_CAR_RECORDS = 'Дополнительная информация:'

SHEET_NAME = 'Заявка'
FIELD_FOR_CHECK_LETTER = 'B'
OBJECTS_FIELD = 'E2'
