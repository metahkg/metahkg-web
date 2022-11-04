FROM node:18-alpine AS build

ARG REACT_APP_recaptchasitekey
ENV REACT_APP_recaptchasitekey $REACT_APP_recaptchasitekey

ARG REACT_APP_VAPID_PUBLIC_KEY
ENV REACT_APP_VAPID_PUBLIC_KEY $REACT_APP_VAPID_PUBLIC_KEY

ARG REACT_APP_IMAGES_DOMAIN
ENV REACT_APP_IMAGES_DOMAIN $REACT_APP_IMAGES_DOMAIN

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

RUN if [ "${env}" != "dev" ]; then yarn install --production; fi;

COPY ./src ./src
COPY ./public ./public
COPY ./scripts ./scripts
COPY ./.babelrc ./config-overrides.js ./

RUN if [ "${env}" = "dev" ]; then mkdir -p build; else yarn build; fi;

FROM node:18-alpine

RUN adduser user -D
WORKDIR /home/user

ARG REACT_APP_recaptchasitekey
ENV REACT_APP_recaptchasitekey $REACT_APP_recaptchasitekey

ARG REACT_APP_VAPID_PUBLIC_KEY
ENV REACT_APP_VAPID_PUBLIC_KEY $REACT_APP_VAPID_PUBLIC_KEY

ARG REACT_APP_IMAGES_DOMAIN
ENV REACT_APP_IMAGES_DOMAIN $REACT_APP_IMAGES_DOMAIN

ARG REACT_APP_build
ENV REACT_APP_build $REACT_APP_build

ARG REACT_APP_date
ENV REACT_APP_date $REACT_APP_date

ARG REACT_APP_version
ENV REACT_APP_version $REACT_APP_version

ARG env
ENV env $env

ENV REACT_APP_ENV $env

COPY --from=build /usr/src/app/build ./build

COPY ./scripts ./scripts

COPY ./package.json ./yarn.lock ./tsconfig.json ./.babelrc ./config-overrides.js ./serve.json  ./postcss.config.js ./tailwind.config.js ./

RUN if [ "${env}" != "dev" ]; then rm -rf tsconfig.json yarn.lock .babelrc config-overrides.js; yarn global add serve; else yarn install; fi;

RUN chown user:user -Rf build node_modules

USER user

COPY ./start.sh ./

CMD sh start.sh
