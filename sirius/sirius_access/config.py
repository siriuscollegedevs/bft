# fields choices
STATUS_CHOICES = (('active', 'Активен'), ('outdated', 'Неактивен'))
STATUS_CHOICES_REQUEST = (('active', 'Активна'), ('outdated', 'Неактивна'))
HISTORY_CHOICES = (('delited', 'Удален'), ('modified',
                   'Изменен'), ('created', 'Создан'))
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
TYPE_CHOICES_ACCOUNT = (
    ('Administrator', 'Администратор'),
    ('manager', 'Руководитель СБ'),
    ('Specialist', 'Специалист СБ'),
    ('security_officer', 'Сотрудник охраны')
)
