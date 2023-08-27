FROM node:18.17.1 AS build_frontend
WORKDIR /frontend
COPY /frontend/package.json .
COPY /frontend/src/ ./src/
COPY /frontend/public/ ./public/
COPY /frontend/.eslintrc.json .
COPY /frontend/.prettierrc .
COPY /frontend/package-lock.json .
COPY /frontend/tsconfig.json .
RUN npm ci
RUN npm run build

FROM python:3.10.13
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /backend
COPY /backend/sirius/ ./sirius/
COPY /backend/requirements.txt .
RUN pip install -r requirements.txt

COPY --from=build_frontend /frontend/build/static ./sirius/static
COPY --from=build_frontend /frontend/build/index.html ./sirius/static

CMD ["sh", "-c", "python ./sirius/manage.py collectstatic --noinput && python ./sirius/manage.py migrate && python ./sirius/manage.py runserver 0.0.0.0:8000"]