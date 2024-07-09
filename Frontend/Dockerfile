FROM node:14.21.3 as angular

WORKDIR /app
COPY . .
RUN npm install
RUN npm build

FROM httpd:alpine3.15
WORKDIR /usr/local/apache2/htdocs
COPY --from=angular /app/dist/frontend .