#!/bin/sh
if [ "${GCM_SENDER_ID}" != "" ];
then sed -i "s/{GCM_SENDER_ID}/${GCM_SENDER_ID}/g" build/manifest.json; fi;
if [ "${PORT}" = "" ] && [ "${port}" != "" ];
then export PORT="${port}"; fi;
if [ "${env}" = "dev" ]; then yarn start:react; else serve -s -l "${PORT:-8080}" --no-clipboard --no-port-switching; fi;
