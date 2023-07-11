# fields choices
STATUS_CHOICES = (('active', 'Активен'), ('outdated', 'Неактивен'))

HISTORY_CHOICES = (('delited', 'Удален'), ('modified',
                   'Изменен'), ('created', 'Создан'))
ACCOUNT_HISTORY_CHOICES = (('delited', 'Удален'), ('modified',
                   'Изменен'), ('created', 'Создан'), ('password_changed', 'Изменен пароль'))
ACTION_CHOICES_RECORD = (
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
TYPE_CHOICES_ACCOUNT = (
    ('administrator', 'Администратор'),
    ('manager', 'Руководитель СБ'),
    ('specialist', 'Специалист СБ'),
    ('security_officer', 'Сотрудник охраны')
)

# MODEL'S FIELDS LEN
CHOICE_FIELD_LEN = 20
DEFAULT_LEN = 50
NAMES_LEN = 20

#VALUE SETS FOR REQUESTS AND RESPONSES
GET_ACCOUNTS_FIELDS = ('id', 'role', 'first_name', 'surname', 'last_name', 'username')
ACCOUNT_GET_REQUEST_FIELDS = ('role', 'first_name', 'surname', 'last_name', 'username', 'password')
GET_ACCOUNT_FIELDS = ('role', 'first_name', 'surname', 'last_name', 'username')

ACCOUNT_TYPES = ('administrator', 'manager', 'specialist', 'security_officer')