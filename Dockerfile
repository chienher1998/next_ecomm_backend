FROM node:18-buster-slim

RUN apt-get update && apt-get install -y openssl libssl-dev ca-certificates

RUN rm -rf /app/db
RUN rm -rf /app/db.test

WORKDIR /

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm install

COPY . /app


RUN --mount=type=secret,id=db_secret \
  DATABASE_URL="$(cat /app/secrets/postgres_connection_string)" \
  npx prisma migrate deploy \
  && npx prisma generate

# RUN --mount=type=secret,id=db_secret \
#   DATABASE_URL=postgres://pixelvaultbackend:3hVt6ot4vgCSAF9@pixelvaultbackend-db.flycast:5432/pixelvaultbackend?sslmode=disable \
#   npx prisma migrate deploy \
#   && npx prisma generate

CMD [ "npm", "run", "start" ]