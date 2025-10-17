FROM node:25-alpine AS deps-dev

WORKDIR /deps

COPY package.json package-lock.json ./

RUN npm ci

# ---

FROM node:25-alpine AS deps-prod

WORKDIR /deps

COPY package.json package-lock.json ./

ENV NODE_ENV=production

RUN npm ci

# ---

FROM node:25-alpine AS build

ENV NODE_ENV=production

WORKDIR /build

COPY --from=deps-dev /deps/node_modules node_modules

COPY . .

RUN npm run build

# ---

FROM node:25-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY --from=deps-prod /deps/node_modules node_modules
COPY --from=build /build/build build
COPY --from=build /build/public public

ENV NODE_ENV="production"

ENTRYPOINT [ "npm" ]

CMD [ "run", "start" ]
