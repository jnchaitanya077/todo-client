FROM alpine:3.14 AS builder

WORKDIR /app

RUN apk add --update npm

COPY package.json .

RUN npm install

COPY . .

RUN npm run build


FROM nginx

EXPOSE 80

COPY --from=builder /app/build /usr/share/nginx/html



