FROM node:23-alpine as base

RUN apk update 

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN npm i pnpm quasar -g

RUN pnpm i



ENTRYPOINT ["npx", "quasar","dev" ]





