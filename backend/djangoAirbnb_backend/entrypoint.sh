#!/bin/sh


if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for PostgreSQL to start..."
    while ! nc -z db 5432; do
      sleep 1
    done
    echo "PostgreSQL started"
fi

python manage.py migrate


exec "$@"