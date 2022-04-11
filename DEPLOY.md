# Deploying Metahkg

You can either:
deploy metahkg-server locally, or
use the public dev api server (dev branch only!)

## Prerequisites

- x86_64 linux (only tested on ubuntu & arch)
- mongodb (either locally or remotely)
- mailgun key (for sending emails, obviously)
- recaptcha site key and secret pair (for anti-spamming)

## Set up

Run `./setup.sh` for a fast setup. It will install all the dependencies for you.
However, you will still need to configure the env variables.
Alternatively, use the following step-by-step guide. It assumes that you have installed all the dependencies.

### Mongodb

```bash
mongoimport -d=metahkg templates/server/category.json
```

### Environmental variables

```bash
cp templates/template.env .env
```

Then edit values in the .env file.
If you use the public dev server you must configure .env to have REACT_APP_categories!

## Build the React app

```bash
yarn install
yarn run build
```

## Deploy

Running  `yarn run start` will start the react app at localhost:3199. (for if you deploy metahkg-server locally)
Run `yarn run start:react` to start the react app at localhost:3000 and use the public dev server.
