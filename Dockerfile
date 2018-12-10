FROM node:10.12
COPY . /app
WORKDIR /app
RUN npm install
CMD cd src && node app.js
EXPOSE 3000