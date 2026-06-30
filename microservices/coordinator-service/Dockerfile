FROM node:24.18.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["npx", "tsx", "src/main.ts"]