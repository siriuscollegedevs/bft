#!/bin/bash

python3 -m venv ./venv

source ./venv/bin/activate

pip install -r requirements.txt

cd sirius

python manage.py collectstatic --noinput

migration_output=$(python manage.py migrate 2>&1)

if [[ $migration_output == *"No migrations to apply."* ]]; then
    
    echo -e "\nОшибка при выполнении миграций. Выполняю reset_db -c...\n"
    echo "yes" | python manage.py reset_db -c
    echo -e "\nВыполняю миграции снова...\n"
    python manage.py migrate
else
    echo -e "\nМиграции выполнены успешно\n"
fi

python manage.py runsslserver
