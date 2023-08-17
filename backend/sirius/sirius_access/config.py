# fields choices
ACCOUNT_HISTORY_CHOICES = (('deleted', 'Удален'), ('modified',
                   'Изменен'), ('created', 'Создан'), ('password_changed', 'Изменен пароль'))

TYPE_CHOICES_ACCOUNT = (
    ('administrator', 'Администратор'),
    ('manager', 'Руководитель СБ'),
    ('specialist', 'Специалист СБ'),
    ('security_officer', 'Сотрудник охраны')
)

# MODEL'S FIELDS LEN
ACTION_ACCOUNT_LEN = 16
ACCOUNT_TYPE_LEN = 16

#VALUE SETS FOR REQUESTS AND RESPONSES
GET_ACCOUNTS_FIELDS = ('id', 'role', 'first_name', 'surname', 'last_name', 'username')
ACCOUNT_GET_REQUEST_FIELDS = ('role', 'first_name', 'surname', 'last_name', 'username', 'password')
GET_ACCOUNT_FIELDS = ('role', 'first_name', 'surname', 'last_name', 'username')

ACCOUNT_TYPES = ('administrator', 'manager', 'specialist', 'security_officer')

# RESPONSE MESSAGES
OBJECTID_ERROR_MSG =  {'error' : 'Invalid ObjectId'}
ACCOUNTID_ERROR_MSG =  {'error' : 'Invalid AccountId'}
SUCCESS_MATCH_DELETION = {'detail': 'Закрепления успешно удалены'}

# ERROR MESSAGES
INVALID_DATA_GIVEN_ERROR = {"error": "Предоставлены неверные данные"}

NO_MATCHES_FOUND_ERROR = {"error": "Закрепления не найдены"}
MATCH_ALREADY_DELETED_ERROR = {"error": "Закрепление уже находится в архиве"}
NO_MATCH_FOUND_ERROR = {"error": "Закрепление с таким id не найдено"}
NO_ACCOUNT_MATCHES_ERROR = {"error": "За данным сотрудником не найдено закреплений"}
SECURITY_OFFICER_MATCH_ERROR = {"error": "Сотрудник охраны не может быть закреплен более чем за 1 объектом"}
EXISTING_MATCH_ERROR = {"error": "Сотрудник уже закреплен за объектом: {object_name}"}

NO_SEARCH_OBJECTS_FOUND_ERROR = {"error": "Объекты по запросу не найдены"}
NO_OBJECT_FOUND_ERROR = {"error": "Объект не найден"}
NO_OBJECTS_GIVEN_ERROR = {"error": "Объекты для закрепления не предоставлены"}

NO_SEARCH_ACCOUNTS_FOUND_ERROR = {"error": "Учётные записи по запросу не найдены"}
NO_ACCOUNT_FOUND_ERROR = {"error": "Учётная запись не найдена"}
NO_ACCOUNTS_FOUND_ERROR = {"error": "Учётные записи не найдены"}
ACCOUNT_ARCHIVE_ERROR = {"error": "Учётная запись находится в архиве"}
NO_ACCOUNTS_BY_OBJECTS_FOUND_ERROR = {"error": "Сотрудники, закрепленные за данными объектами, не найдены."}
