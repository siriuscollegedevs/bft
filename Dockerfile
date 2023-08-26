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
WORKDIR /backend
COPY /backend/sirius/ ./
COPY /backend/requirements.txt .
RUN pip install -r requirements.txt

COPY --from=build_frontend /frontend/build/static ./static
COPY --from=build_frontend /frontend/build/index.html ./static

CMD [ "python", "manage.py", "runserver" ]