FROM node:alpine as build
WORKDIR /home/app
COPY . .
RUN npm ci

FROM node:alpine
WORKDIR /home/app
ENV DOCKERIZE_VERSION v0.7.0
RUN apk update --no-cache \
    && apk add --no-cache wget openssl \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apk del wget
COPY --from=build /home/app .
EXPOSE 3000
CMD  ["node", "./server.js"]
