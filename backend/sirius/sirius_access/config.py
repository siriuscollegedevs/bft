# fields choices
ACCOUNT_HISTORY_CHOICES = (('delited', 'Удален'), ('modified',
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