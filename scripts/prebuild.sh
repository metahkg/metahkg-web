#!/bin/sh

if [ -z "$REACT_APP_version" ];
then export REACT_APP_version=$(node -e "console.log(require('./package.json').version)");
fi;

if [ -z "$REACT_APP_build" ];
then export REACT_APP_build=$(git rev-parse --short HEAD);
fi;

if [ -z "$REACT_APP_date" ];
then export REACT_APP_date=$(date +"%Y-%m-%dT%H:%M:%S");
fi;
