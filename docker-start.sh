#!/bin/sh
if [ "${REACT_APP_recaptchasitekey}" != "" ]; \
then sed -i "s/{RECAPTCHA_SITE_KEY}/${REACT_APP_recaptchasitekey}/g" build/static/js/*.js*; fi; \
if [ "${REACT_APP_IMAGES_DOMAIN}" != "" ]; \
then sed -i "s/{IMAGES_DOMAIN}/${REACT_APP_IMAGES_DOMAIN}/g" build/static/js/*.js*; fi; \
export PORT=${port}; \
if [ "${env}" = "dev" ]; then yarn start:react; else (yarn start -l ${port} || yarn start); fi;
