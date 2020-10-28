FROM node:12-alpine AS deps

WORKDIR /app

ARG REMIX_TOKEN

ADD package.json package-lock.json .npmrc ./

RUN npm ci

FROM node:12-alpine AS production-deps

WORKDIR /app

ARG REMIX_TOKEN

ADD package.json package-lock.json .npmrc ./

RUN npm ci

FROM node:12-alpine AS build

WORKDIR /app

ARG REMIX_TOKEN

COPY --from=deps /app/node_modules /app/node_modules
ADD . .
COPY public /app/public

ENV NODE_ENV=production

RUN npm run build

FROM node:12-alpine

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/server-build /app/server-build
COPY --from=build /app/src/server.js /app/src/server.js
COPY --from=build /app/app /app/app
COPY --from=build /app/public /app/public
ADD package.json remix.config.js ./

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT [ "npm" ]

CMD [ "run", "start" ]
