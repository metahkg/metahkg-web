FROM node:18-alpine AS build

ARG REACT_APP_recaptchasitekey
ENV REACT_APP_recaptchasitekey $REACT_APP_recaptchasitekey

ARG REACT_APP_IMAGES_API_URL
ENV REACT_APP_IMAGES_API_URL $REACT_APP_IMAGES_API_URL

ARG REACT_APP_build
ENV REACT_APP_build $REACT_APP_build

ARG REACT_APP_date
ENV REACT_APP_date $REACT_APP_date

ARG REACT_APP_version
ENV REACT_APP_version $REACT_APP_version

ARG env
ENV env $env

ENV REACT_APP_ENV $env

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./tsconfig.json ./postcss.config.js ./tailwind.config.js ./

RUN if [ "${env}" = "dev" ]; then yarn install; else yarn install --production; fi;

COPY ./src ./src
COPY ./public ./public
COPY ./scripts ./scripts
COPY ./.babelrc ./config-overrides.js ./

RUN if [ "${env}" = "dev" ]; then mkdir -p build; else yarn build; fi;

FROM node:18-alpine

ARG REACT_APP_recaptchasitekey
ENV REACT_APP_recaptchasitekey $REACT_APP_recaptchasitekey

ARG REACT_APP_IMAGES_API_URL
ENV REACT_APP_IMAGES_API_URL $REACT_APP_IMAGES_API_URL

ARG REACT_APP_build
ENV REACT_APP_build $REACT_APP_build

ARG REACT_APP_date
ENV REACT_APP_date $REACT_APP_date

ARG REACT_APP_version
ENV REACT_APP_version $REACT_APP_version

ARG env
ENV env $env

ENV REACT_APP_ENV $env

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./build

COPY ./scripts ./scripts

COPY ./package.json ./yarn.lock ./tsconfig.json ./.babelrc ./config-overrides.js ./serve.json  ./postcss.config.js ./tailwind.config.js ./

RUN if [ "${env}" != "dev" ]; then rm -rf tsconfig.json yarn.lock .babelrc config-overrides.js; yarn global add serve; else yarn install; fi;

CMD if [ "${REACT_APP_recaptchasitekey}" != "" ]; then sed -i "s/{RECAPTCHA_SITE_KEY}/${REACT_APP_recaptchasitekey}/g" build/static/js/*.js*; fi; export PORT=${port}; if [ "${env}" = "dev" ]; then yarn start:react; else (yarn start -l ${port} || yarn start); fi;
