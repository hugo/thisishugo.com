FROM node:16-alpine3.14 as deps-dev

WORKDIR /deps

COPY package.json package-lock.json ./

RUN npm ci

# ---

FROM node:16-alpine3.14 as deps-prod

WORKDIR /deps

COPY package.json package-lock.json ./

ENV NODE_ENV=production

RUN npm ci

# ---

FROM node:16-alpine3.14 as build

ENV NODE_ENV=production

WORKDIR /build

COPY --from=deps-dev /deps/node_modules node_modules

COPY . .

RUN npm run build

# ---

FROM node:16-alpine3.14

WORKDIR /app

COPY package.json package-lock.json ./

COPY --from=deps-prod /deps/node_modules node_modules
COPY --from=build /build/build build
COPY --from=build /build/public public

ENV PATH="$PATH:node_modules/.bin"
ENV NODE_ENV="production"

ENTRYPOINT [ "npm" ]

CMD [ "run", "start" ]
