FROM node:latest AS build

ARG REACT_APP_recaptchasitekey
ENV REACT_APP_recaptchasitekey $REACT_APP_recaptchasitekey

ARG env
ENV env $env

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./

RUN yarn install

COPY ./src ./src
COPY ./public ./public
COPY ./.babelrc ./
COPY ./config-overrides.js ./

RUN if [ "${env}" = "dev" ]; then mkdir -p build; else yarn run build; fi;

FROM node:latest

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build

COPY ./public ./public
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./
COPY ./server.js ./

RUN yarn install

CMD export PORT=${port} && if [ "${env}" = dev ]; then npx react-app-rewired start; else node server.js; fi;
