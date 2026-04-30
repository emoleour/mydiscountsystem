FROM python:3.12-slim

WORKDIR /code

# Копируем и устанавливаем зависимости
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Копируем код приложения
COPY ./app /code/app
COPY ./main.py /code/

# Указываем порт, который будет слушать контейнер
EXPOSE 8000

# Запускаем сервер, используя переменную окружения PORT
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]