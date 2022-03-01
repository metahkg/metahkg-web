# Deploying Metahkg

## Prerequisites

- x86_64 debian linux (only tested on ubuntu)
- mongodb (either locally or remotely)
- mailgun key (for sending emails, obviously)
- hcaptcha site key and secret pair (for anti-spamming)

## Set up

Run `./setup.sh` for a fast setup. It will install all the dependencies for you.
However, you will still need to configure the env variables.
Alternatively, use the following step-by-step guide. It assumes that you have installed all the dependencies.

### Mongodb

```bash
mongoimport -d=metahkg-threads templates/server/category.json
```

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
Running  `yarn run start` will start the react app at localhost:3199.
