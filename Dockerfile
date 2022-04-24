FROM node:latest AS build

ARG REACT_APP_recaptchasitekey
ENV REACT_APP_recaptchasitekey $REACT_APP_recaptchasitekey

ARG env
ENV env $env

WORKDIR /usr/src/app

COPY . ./

RUN yarn install
RUN if [ "${env}" = "dev" ]; then mkdir -p build; else yarn run build; fi;

FROM node:latest

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/ ./

RUN yarn install

CMD export PORT=${port} && if [ "${env}" = dev ]; then npx react-app-rewired start; else node server.js; fi;
