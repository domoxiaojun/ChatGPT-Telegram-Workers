FROM node:alpine AS DEV

WORKDIR /app
COPY package.json vite.config.ts tsconfig.json ./
COPY src ./src
RUN npm install && npm run build:local

FROM node:alpine as prod

WORKDIR /app
COPY --from=DEV /app/dist/index.js /app/dist/index.js
COPY --from=DEV /app/package.json /app/
RUN apk add --no-cache sqlite python3 make g++ && \
    npm install --omit=dev && \
    npm cache clean --force && \
    apk del python3 make g++
EXPOSE 8787
CMD ["npm", "run", "start:dist"]
