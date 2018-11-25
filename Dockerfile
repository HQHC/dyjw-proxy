FROM node:10.8
COPY . /app
WORKDIR /app
RUN npm install node app.js
EXPOSE 3000