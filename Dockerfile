FROM node:26-alpine AS deps
WORKDIR /deps
COPY package.json package-lock.json ./
COPY patches ./patches
RUN npm ci --omit=dev

FROM node:26-alpine AS build
WORKDIR /build
COPY package.json package-lock.json ./
COPY patches ./patches
RUN npm ci
COPY . .
RUN npm run build

FROM node:26-alpine
WORKDIR /app
COPY package.json ./
COPY --from=deps /deps/node_modules node_modules
COPY src ./src
COPY --from=build /build/dist dist
# NOTE: node runs directly so SIGTERM reaches the server's scope finalizers.
ENTRYPOINT ["node", "src/server/main.prod.ts"]
USER node
