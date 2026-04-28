FROM node:24-alpine AS dev

WORKDIR /app
COPY package.json vite.config.ts tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
RUN npm install && npm run build:local

FROM node:24-alpine AS prod

WORKDIR /app
COPY --from=dev /app/dist/index.js /app/dist/index.js
COPY --from=dev /app/package.json /app/
RUN apk add --no-cache sqlite && \
    apk add --no-cache --virtual .build-deps python3 make g++ && \
    npm install --omit=dev && \
    npm cache clean --force && \
    apk del .build-deps
EXPOSE 8787
CMD ["npm", "run", "start:dist"]
