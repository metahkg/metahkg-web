# Metahkg Web

This is the metahkg web app. For backend api, please refer to [metahkg/metahkg-server](https://gitlab.com/metahkg/metahkg-server).

stable: [metahkg.org](https://metahkg.org)

dev build (probably daily): [dev.metahkg.org](https://dev.metahkg.org)

[![React](https://badges.aleen42.com/src/react.svg)](http://reactjs.org/)
[![Typescript](https://badges.aleen42.com/src/typescript.svg)](https://www.typescriptlang.org/)

[![Gitlab](https://badges.aleen42.com/src/gitlab.svg)](https://gitlab.com/metahkg/metahkg-web)
[![Github](https://badges.aleen42.com/src/github.svg)](https://github.com/metahkg/metahkg-web)
[![License](https://img.shields.io/gitlab/license/metahkg/metahkg-web)](https://gitlab.com/metahkg/metahkg-web/-/tree/master/LICENSE.md)

[![DeepSource](https://deepsource.io/gh/metahkg/metahkg-web.svg/?label=active+issues&show_trend=true&token=oM1NNBO8D9mefjjcuiCmPQoS)](https://deepsource.io/gh/metahkg/metahkg-web/?ref=repository-badge)
[![DeepSource](https://deepsource.io/gh/metahkg/metahkg-web.svg/?label=resolved+issues&show_trend=true&token=oM1NNBO8D9mefjjcuiCmPQoS)](https://deepsource.io/gh/metahkg/metahkg-web/?ref=repository-badge)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/0c0ee09f0cca4d6fa17d3b4f4465faf8)](https://www.codacy.com/gl/metahkg/metahkg-web/dashboard?utm_source=gitlab.com&utm_medium=referral&utm_content=metahkg/metahkg-web&utm_campaign=Badge_Grade)

## About

This open-source project was created primarily because of me being unable to register a lihkg account as a high school student.

Currently, it aims to be a fully featured alternative to lihkg. However, I might also add other useful features.

As contrasted with lihkg, metahkg is open to everyone and anyone can create an account with a email address, no matter issued by a university or not.

## Use as a module

Since v2.4.0, you can use metahkg-web as a module.

### Install

```bash
yarn add metahkg-web
```

### Usage

```tsx
import React from "react";
import MetahkgWebApp from "metahkg-web";

export default function App() {
    return <MetahkgWebApp reCaptchaSiteKey={"<your-recaptcha-site-key>"} />;
}
```

### Build from source

```bash
yarn build:module
```

The artifact would be in ./dist

## Deploying

### Docker

It is recommended to use docker for deployment (also supports hot reload).

[Docs](https://docs.metahkg.org/docs/category/deploy-metahkg)

### Manually

> **_WARNING:_** This is NOT RECOMMENDED and might be OUTDATED!

For manual deployment, see DEPLOY.md.

## License

[AGPL-3.0-or-later](./LICENSE.md).

### Logo

Logo (public/images/logo.svg) originally by "white card", CC-BY-4.0.
Modified versions by wcyat, CC0.
See [public/images/LICENSE](./public/images/LICENSE) for details.
