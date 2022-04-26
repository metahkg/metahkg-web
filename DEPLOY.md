# Deploying Metahkg (web)

You can either:
deploy metahkg-server locally, or
use the public dev api server (dev branch only!)

## Prerequisites

- x86_64 linux (only tested on ubuntu & arch)
- recaptcha site key (for anti-spamming)

## Set up

### Environmental variables

```bash
cp templates/template.env .env
```

Then edit values in the .env file.

## Build the React app

```bash
yarn install
yarn run build
```

## Deploy

Running  `yarn run start` will start the react app at localhost:3199. (for if you deploy metahkg-server locally)
Run `yarn run start:react` to start the react app at localhost:3000 and use the public dev server.
