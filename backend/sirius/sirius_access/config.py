# fields choices
STATUS_CHOICES = (('active', 'Активен'), ('outdated', 'Неактивен'))

HISTORY_CHOICES = (('delited', 'Удален'), ('modified',
                   'Изменен'), ('created', 'Создан'))
ACCOUNT_HISTORY_CHOICES = (('delited', 'Удален'), ('modified',
                   'Изменен'), ('created', 'Создан'), ('password_changed', 'Изменен пароль'))

TYPE_CHOICES_ACCOUNT = (
    ('administrator', 'Администратор'),
    ('manager', 'Руководитель СБ'),
    ('specialist', 'Специалист СБ'),
    ('security_officer', 'Сотрудник охраны')
)

# MODEL'S FIELDS LEN
DEFAULT_LEN = 50
NAMES_LEN = 20
ACTION_ACCOUNT_LEN = 16
DEFAULT_ACTION_LEN = 10
ACCOUNT_TYPE_LEN = 16
STATUS_LEN = 10

#VALUE SETS FOR REQUESTS AND RESPONSES
GET_ACCOUNTS_FIELDS = ('id', 'role', 'first_name', 'surname', 'last_name', 'username')
ACCOUNT_GET_REQUEST_FIELDS = ('role', 'first_name', 'surname', 'last_name', 'username', 'password')
GET_ACCOUNT_FIELDS = ('role', 'first_name', 'surname', 'last_name', 'username')

ACCOUNT_TYPES = ('administrator', 'manager', 'specialist', 'security_officer')