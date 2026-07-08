FROM node:24.18.0-alpine AS base

WORKDIR /app

COPY package*.json ./

EXPOSE 3000

FROM base AS development

RUN npm ci

COPY . .

CMD ["npm", "start"]

FROM base AS production

RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]
