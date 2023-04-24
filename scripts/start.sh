#!/bin/sh
if [ "${REACT_APP_RECAPTCHA_SITE_KEY}" != "" ];
then sed -i "s/{RECAPTCHA_SITE_KEY}/${REACT_APP_RECAPTCHA_SITE_KEY}/g" build/static/js/*.js*; fi;
if [ "${REACT_APP_TURNSTILE_SITE_KEY}" != "" ];
then sed -i "s/{TURNSTILE_SITE_KEY}/${REACT_APP_TURNSTILE_SITE_KEY}/g" build/static/js/*.js*; fi;
if [ "${REACT_APP_IMAGES_DOMAIN}" != "" ];
then sed -i "s/{IMAGES_DOMAIN}/${REACT_APP_IMAGES_DOMAIN}/g" build/static/js/*.js*; fi;
if [ "${REACT_APP_RLP_PROXY_DOMAIN}" != "" ];
then sed -i "s/{RLP_PROXY_DOMAIN}/${REACT_APP_RLP_PROXY_DOMAIN}/g" build/static/js/*.js*; fi;
if [ "${REACT_APP_REDIRECT_DOMAIN}" != "" ];
then sed -it "s/{REDIRECT_DOMAIN}/${REACT_APP_REDIRECT_DOMAIN}/g" build/static/js/*.js*; fi;
if [ "${GCM_SENDER_ID}" != "" ];
then sed -i "s/{GCM_SENDER_ID}/${GCM_SENDER_ID}/g" build/manifest.json; fi;
if [ "${PORT}" = "" ] && [ "${port}" != "" ];
then export PORT="${port}"; fi;
if [ "${env}" = "dev" ]; then yarn start:react; else serve -s -l "${PORT:-8080}" --no-clipboard --no-port-switching; fi;
