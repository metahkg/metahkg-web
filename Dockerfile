FROM node:latest AS build

ARG REACT_APP_recaptchasitekey
ENV REACT_APP_recaptchasitekey $REACT_APP_recaptchasitekey

WORKDIR /usr/src/app

RUN yarn add typescript

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

COPY . ./
RUN yarn install
RUN yarn run build

FROM node:latest

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./yarn.lock .
COPY ./server.js .
COPY --from=build /usr/src/app/build ./build

RUN yarn install

CMD node server.js