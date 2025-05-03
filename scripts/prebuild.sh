#!/bin/sh

if [ -z "$VITE_APP_version" ];
then export VITE_APP_version=$(node -e "console.log(require('./package.json').version)");
fi;

if [ -z "$VITE_APP_build" ];
then export VITE_APP_build=$(git rev-parse --short HEAD);
fi;

if [ -z "$VITE_APP_date" ];
then export VITE_APP_date=$(date +"%Y-%m-%dT%H:%M:%S");
fi;
