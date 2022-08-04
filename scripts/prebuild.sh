if [ -z "$REACT_APP_version" ];
then export REACT_APP_version=$(node -e "console.log(require('./package.json').version)");
fi;

if [ -z "$REACT_APP_build" ];
then export REACT_APP_build=$(git rev-parse --short HEAD || date +"%Y-%m-%dT%H:%M:%S");
fi;
