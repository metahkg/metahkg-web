FROM node:18-alpine AS build

ARG REACT_APP_recaptchasitekey
ENV REACT_APP_recaptchasitekey $REACT_APP_recaptchasitekey

ARG REACT_APP_build
ENV REACT_APP_build $REACT_APP_build

ARG REACT_APP_version
ENV REACT_APP_version $REACT_APP_version

ARG env
ENV env $env

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./

RUN if [ "${env}" = "dev" ]; then yarn install; else yarn install --production; fi;

COPY ./src ./src
COPY ./public ./public
COPY ./.babelrc ./
COPY ./config-overrides.js ./

RUN if [ "${env}" = "dev" ]; then mkdir -p build; else yarn run build; fi;

FROM node:18-alpine

ARG REACT_APP_recaptchasitekey
ENV REACT_APP_recaptchasitekey $REACT_APP_recaptchasitekey

ARG env
ENV env $env

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./build

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./.babelrc ./
COPY ./config-overrides.js ./
COPY ./serve.json ./

RUN if [ "${env}" = "dev" ]; then yarn install; else (rm tsconfig.json .babelrc config-overrides.js; yarn global add serve); fi;

CMD if [ "${REACT_APP_recaptchasitekey}" != "" ]; then sed -i "s/{RECAPTCHA_SITE_KEY}/${REACT_APP_recaptchasitekey}/g" build/static/js/*.js*; fi; export PORT=${port}; if [ "${env}" = "dev" ]; then yarn start:react; else (yarn start -l ${port} || yarn start); fi;
