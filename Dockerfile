# Copyright (C) 2022-present Metahkg Contributors
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

FROM node:18-alpine AS build

ARG REACT_APP_RECAPTCHA_SITE_KEY
ENV REACT_APP_RECAPTCHA_SITE_KEY $REACT_APP_RECAPTCHA_SITE_KEY

ARG REACT_APP_TURNSTILE_SITE_KEY
ENV REACT_APP_TURNSTILE_SITE_KEY $REACT_APP_TURNSTILE_SITE_KEY

ARG REACT_APP_VAPID_PUBLIC_KEY
ENV REACT_APP_VAPID_PUBLIC_KEY $REACT_APP_VAPID_PUBLIC_KEY

ARG REACT_APP_IMAGES_DOMAIN
ENV REACT_APP_IMAGES_DOMAIN $REACT_APP_IMAGES_DOMAIN

ARG REACT_APP_RLP_PROXY_DOMAIN
ENV REACT_APP_RLP_PROXY_DOMAIN $REACT_APP_RLP_PROXY_DOMAIN

ARG REACT_APP_REDIRECT_DOMAIN
ENV REACT_APP_REDIRECT_DOMAIN $REACT_APP_REDIRECT_DOMAIN

ARG REACT_APP_build
ENV REACT_APP_build $REACT_APP_build

ARG REACT_APP_date
ENV REACT_APP_date $REACT_APP_date

ARG REACT_APP_version
ENV REACT_APP_version $REACT_APP_version

ARG env
ENV env $env

ENV REACT_APP_ENV $env

WORKDIR /app

COPY ./package.json ./yarn.lock ./tsconfig.json ./postcss.config.js ./tailwind.config.js ./

RUN chown -Rf node:node /app

USER node

RUN yarn install --frozen-lockfile --network-timeout 1000000

COPY ./src ./src
COPY ./public ./public
COPY ./scripts ./scripts
COPY ./.babelrc ./config-overrides.js ./

RUN if [ "${env}" != "dev" ]; then yarn build && rm -rf node_modules && mkdir node_modules; fi;
RUN if [ "${env}" != "dev" ]; then rm -rf tsconfig.json yarn.lock .babelrc config-overrides.js postcss.config.js tailwind.config.js; fi;

FROM node:18-alpine

WORKDIR /app

ARG REACT_APP_RECAPTCHA_SITE_KEY
ENV REACT_APP_RECAPTCHA_SITE_KEY $REACT_APP_RECAPTCHA_SITE_KEY

ARG REACT_APP_TURNSTILE_SITE_KEY
ENV REACT_APP_TURNSTILE_SITE_KEY $REACT_APP_TURNSTILE_SITE_KEY

ARG REACT_APP_VAPID_PUBLIC_KEY
ENV REACT_APP_VAPID_PUBLIC_KEY $REACT_APP_VAPID_PUBLIC_KEY

ARG REACT_APP_IMAGES_DOMAIN
ENV REACT_APP_IMAGES_DOMAIN $REACT_APP_IMAGES_DOMAIN

ARG REACT_APP_RLP_PROXY_DOMAIN
ENV REACT_APP_RLP_PROXY_DOMAIN $REACT_APP_RLP_PROXY_DOMAIN

ARG REACT_APP_build
ENV REACT_APP_build $REACT_APP_build

ARG REACT_APP_date
ENV REACT_APP_date $REACT_APP_date

ARG REACT_APP_version
ENV REACT_APP_version $REACT_APP_version

ARG env
ENV env $env

ENV REACT_APP_ENV $env

COPY --from=build /app/build* ./build
COPY --from=build /app/node_modules ./node_modules

COPY ./scripts ./scripts

COPY --from=build /app/package.json /app/yarn.lock* /app/tsconfig.json* /app/.babelrc* /app/config-overrides.js* /app/postcss.config.js* /app/tailwind.config.js*  ./
COPY ./serve.json ./

RUN if [ "${env}" != "dev" ]; then yarn global add serve --network-timeout 1000000; fi;

RUN chown -f node:node /app /app/node_modules && if [ -d /app/build  ]; then chown -Rf node:node /app/build; fi;

USER node

CMD yarn start
