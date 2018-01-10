FROM node:6

MAINTAINER Jhow

COPY . /code

WORKDIR /code

RUN npm install

EXPOSE 3357

CMD ["npm", "start"]
