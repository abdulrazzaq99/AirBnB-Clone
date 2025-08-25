FROM python:3.11-slim-bullseye

WORKDIR /usr/src/djangobnb_backend

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y libjpeg-dev zlib1g-dev netcat-openbsd && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY ./entrypoint.sh .
RUN sed -i 's/\r//g' entrypoint.sh
RUN chmod +x entrypoint.sh

COPY . .

ENTRYPOINT [ "./entrypoint.sh" ]