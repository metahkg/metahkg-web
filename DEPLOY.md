# Deploying Metahkg (web)

## Docker

It is recommended to use docker for deployment (also supports hot reload).

Docs:

- master branch [master.docs.metahkg.org/docker](https://master.docs.metahkg.org/docker)
- dev branch [dev.docs.metahkg.org/docker](https://dev.docs.metahkg.org/docker)

## Manually

**_WARNING:_** This is NOT RECOMMENDED and might be OUTDATED!

You can either:
deploy metahkg-server locally, or
use the public dev api server (dev branch only!)

### Prerequisites

- x86_64 linux (only tested on ubuntu & arch)
- recaptcha site key (for anti-spamming)

### Set up

#### Environmental variables

Edit values in the .env file.

### Build the React app

```bash
yarn install
yarn run build
```

### Deploy

#### Local metahkg-server

Running  `yarn run start` will start the react app at localhost:3199. (for if you deploy metahkg-server locally)

#### Public dev server

> **_WARNING:_** You must use `metahkg.test.wcyat.me` as the domain, or recaptcha can't be used!

Run `yarn run start:react` to start the react app at localhost:3000 and use the public dev server.
