#### 6.6.0 (2023-03-30)

##### Chores

*  v6.6.1 (052c0651)

##### Continuous Integration

*  fix tagging (81f3a9ad)

##### New Features

* **captcha:**  add turnstile support - migrated to v6.6.1 api - WARNING: turnstile may not work currently (fe331778)
* **comment:**  link to edited admin (f0260dc8)
*  force disable filter swear words on safari /ios (webkit) (4150700e)
*  allow opt out of resize images via setting (39be74bd)
*  redirect to login if visibility is internal and user not logged in (3054844b)
* **parse error:**  include message (a0565512)

##### Bug Fixes

* **tinymce:**  disable autosave restore (82804e27)
* **emotion list:**  link color (19976682)
* **avatar:**  avatar not shown when visibility is internal - changed to generate a blob url using the data from api.userAvatar (c1b209b0)
* **profile:**  wrong position of name and id (6f3e6f97)

##### Other Changes

*  CHANGELOG.md (2cd8f0f4)
*  CHANGELOG.md (a013c9bd)
*  CHANGELOG.md (8101c897)

#### 6.4.1 (2023-02-16)

##### Chores

-   v6.4.1 (66933900)

##### Continuous Integration

-   fix tagging (b138e047)
-   **tagging:** fetch and merge before pushing changes to changelog (24e69a77)

##### Documentation Changes

-   generate CHANGELOG.md using generate-changelog (ba18c2b5)
-   remove deprecated DEPLOY.md (8bcfa9c7)

##### New Features

-   use a standard size for images in comments & use a lower quality to reduce file size (fff4752c)
-   opt out of auto load images (aa696054)

##### Bug Fixes

-   add noopener for target="\_blank" (1132f631)
-   **uploadavatar:** allow async function (07274b2b)

##### Other Changes

-   //gitlab.com/metahkg/metahkg-web into dev (3ed4ef95)

#### 6.4.0 (2023-02-13)

##### Chores

-   upgrade serve (44d81c00)
-   6.4.0 (faa5e8fa)
-   upgrade dependencies (a759b1c8)
-   generate third-party licenses (4da8f12d)

##### New Features

-   integrate metahkg-redirect (97ca36f0)
-   replace legacy sidebar with sidepanel drawer (small screens) (46648823)
-   expandable side panel (4aeb7d21)
-   light mode (501b97ec)
-   tinymce autosave (626b9cfe)
-   comment string length limit (4c68f2e0)
-   **tinymce:**
    -   switch editor theme while editing (199198f9)
    -   spellcheck (70a4d294)
-   **side panel:** resize transition (52ac33c8)

##### Bug Fixes

-   conversation page bottom license text color (3ba2c8e6)
-   set interval to fetch blocked and starred list only if user is defined (5c77194d)
-   disable clipboard and port switching for serve (12b17afb)
-   allow overflow auto for y (9b59f591)
-   scrollbar in light theme (e9956f5a)
-   prism theme (92baaa9c)
-   light theme blockquote (56800b8b)
-   upgrade @metahkg/react-link-preview (39ba3efe)
-   link color (8bc76fb4)
-   remove previously added theme class name (f4f6667b)
-   add dark class to body (f14306e5)
-   popup, share (width) (52570143)
-   fixed a scrollbar glitch that affected chromium browsers (322445a4)
-   **verify:** reset recaptcha on fail (59007bee)
-   **Dockerfile:** add redirect domain build arg (fe473cbf)
-   **notfound, forbidden:** use width 100% instead of 100vw (c0795469)
-   **side panel:**
    -   use 200ms for transition duration (ea80928f)
    -   set metahkg logo width to 30 (0631f8fd)
-   **searchbar:** chip position (86de52a4)
-   **sidebar:** close drawer on link clicked (e12de431)
-   **link:** text decoration color (d311bd12)
-   **comment show replies button:** light theme colors (ce95b53f)
-   **floating editor:** comment margin (b9e8fbfe)
-   **app context:** improve performance use useState instead of const (f97214a5)
-   **docker:**
    -   fix dev environment (6a928d23)
    -   chown (acf6cbe6)

##### Other Changes

-   @metahkg/rlp-proxy-rewrite-api (78bf642d)
-   add setup script (bf2fed18)
-   add tooltip for expand (6b2dcaba)
-   set autosave to 20s (73a91ac3)
-   add color prop (3e931a68)
-   rename home to metahkg (b7792ff9)
-   use 220px (cbaad71f)
-   white css added padding for category button changed some px to standard units (tailwind) added css baseline use loading button (90539aa3)
-   grey for tags & white for categories (ede8f2c1)
-   place hidden categories at last (b6302317)
-   add third-party licenses & logo copyright (9decc0f5)

#### 6.3.0

##### Chores

-   version 6.3.0 (702cb181)
-   upgrade @metahkg/api (9dbb1eb1)

##### Continuous Integration

-   multi-arch build amd64 and arm64 (05759f8a)

##### New Features

-   side panel (desktop only, for now) (9b32c50d)

##### Bug Fixes

-   switch to use imgpush (2230d068)
-   category app context (11d0f814)
-   **login, register:** use 50px margin (71c86530)
-   **register:** remove h-full (db136399)
-   **commentBody & commentTop:** remove unnecessary comment-body class (920aa4ac)
-   **comment:** remove spacer (46fc7232)

##### Other Changes

-   Dockerfile (9806061c)
-   yarn install timeout 1000000 (aded1ec4)
-   replace some of the css with tailwind (4db0fe4e)
-   use grey for category names and white for tags (7598ffaa)
-   not to show category in others if it is pinned (c0ca16fd)
-   use href instead of to; add target & rel (d15dd8cf)
-   respect backend env variable (e83998bd)
-   set border radius to 10px (c50b70c5)
-   2022-present (cef5cbd6)
-   disable touch ripple (6b4e2b9b)
-   remove conversation-root class (69b1b893)
-   stack the linear progress on the thread component (b58fc888)
-   @metahkg/react-link-preview (d605b488)
-   **emotions:** present only one emoji for small screens (f2f6888e)

#### 6.2.0

##### Chores

-   move start.sh to scripts (75ec6451)
-   version 6.2.0 (dev) (13ce25fc)

##### Continuous Integration

-   tag only if package.json is changed (f094e08d)

##### Bug Fixes

-   specify sh (4bdb00db)
-   .gitlab-ci.yml (a7cb98bb)
-   create thread mobile ui (5a07ebef)
-   migrate to axios v1.2 (5da1af27)
-   reset password should be available even whem logged in (a20f1db0)

##### Other Changes

-   remove unnessary npx calls (48fa142d)
-   //gitea.wcyat.me/metahkg/Metahkg-web into dev (498f457e)
-   use double quote & set default port to 8080 (f386ffb1)
-   get blocked / starred list only when user id is changed, setInterval only once; reload user only if session.token is changed (cb1fbe25)
-   add tsx (57d16dd4)
-   api v6.2 (dd1a0b79)
-   retry twice (6258ecc3)
-   //gitea.wcyat.me/metahkg/Metahkg-web into dev (8de5ea9b)
-   lint changed files and stage (lint) changes; test / lint only when needed (218c1476)
-   Dockerfile (88f53f0b)
-   switch to @metahkg/csstojson (67de5f20)
-   no border (same color) (e5481ba1)
-   also update the session state (15908e4d)
-   make userid font size smaller than username & align end (b91fd1c5)
-   limit title length to 50 (dd76b845)
-   //gitea.wcyat.me/metahkg/Metahkg-web into dev (9d09c250)
-   upgrade @metahkg/react-link-preview & remove console.log (d1eeb93d)

#### 6.1.0

##### Chores

-   version 6.1.0 (2c541564)

##### Other Changes

-   api v6.1 (7ec2dd8b)

## v6.0.0

-   migrate to api v6.0
-   use `useSession` hook to manage login status (src/components/AppContextProvider.tsx)
-   refresh session when authSessionCurrent gives 401 error (src/hooks/app/useCheckSession.tsx)
-   no longer uses `localStorage.token` in favor of `localStorage.session` json (src/components/AppContextProvider.tsx)
-   remove the response interceptor (src/lib/api.ts)

## v5.9.0

-   forgot / reset password

## v5.8.0

-   _WARNING_: Please change your recaptcha type to v2 invisible at [recaptcha admin panel](https://www.google.com/recaptcha/admin) before upgrading to this version
-   implement [epic &23](https://gitlab.com/groups/metahkg/-/epics/23) switch to recaptcha v2 invisible
-   require recaptcha for login

## v5.7.3

-   use image proxy with `react-link preview`
-   move csp to `index.html`
-   custom `rlp-proxy` domain (`REACT_APP_RLP_PROXY_DOMAIN`)

## v5.7.1

-   fix: link preview: return the original component if link preview doesn't work

## v5.7.0

-   verify: support restrict to same ip

## v5.5.0

-   implement push notification frontend

## v5.4.0

-   send a logout request to server to revoke the session upon logout

## v5.3.0

-   add option to restrict session to same ip
-   show status code in error message

## v5.1.0

-   use avatars generated by mui avatar if no avatar has been uploaded
-   implement edit comment (admin)
-   implement delete comment (admin)

## v5.0.0

-   rounded comments

## v4.4.0

-   add emotions list (opened by clicked the more button)
-   show users who expressed the emotion after clicking it in emotions list

## v4.3.0

-   add emotions feature

## v4.2.0

-   star threads
-   also hide comments of blocked users in quotes
-   add reason to block
-   add streamable support
-   create thread auto resize

## v4.0.3

-   avatar editor

## v4.0.0

-   use IBM Plex Sans as font

## v3.5.0

-   migrate to tailwindcss

## v3.4.0

-   filter swear words option
-   block users (alpha)

## v2.8.1

-   add support for facebook and instagram
-   allow images for maximum 800px height

## v2.8.0

-   upgrade to metahkg-api v2.8.0

## v2.5.10

-   service worker (alpha)

## v2.5.9

-   fixed conversation (scroll and pagify)
-   mode-based menu, more simple
-   disable and enable menu before loading the components
-   general fixes

## v2.5.8

-   synchronized search bars
-   sync query to url
-   record last query

## v2.5.7

-   re-fix the images on mobile devices by disabling display inline-block on condition

## v2.5.6

-   fix the swipeable view feature (rewrite)

## v2.5.5

-   swipeable views for menu

## v2.5.4

-   fix the white space above and below images on mobile devices (new comments only, old comments still have this issue)
-   reload after the token is removed because of expiration

## v2.5.3

-   add a circular loader for profile and gallery
-   add an upload images button in tinymce (so users don't need to use images plugin and click three buttons)
-   allow users to resize images, small and normal, in quotes it is small by default

## v2.5.2

-   link preview only if the href match the text

## v2.5.1

-   add link preview

## v2.5.0

-   improved the floating editor (bottom toolbar, removed menubar and statusbar)
-   remove upload image button in favor of implementing the functionality in the photo plugin of tinymce
-   configure image styles using content css in tinymce, setContent not needed
-   deprecate votebar which doesn't work well with replies button
-   vote buttons can now update the global state
-   remove the addcomment page, as all comments now use the floating editor

## v2.4.0

-   metahkg-web can now be used as a module
-   removed /profile/self
-   remove change of gender

## v2.2.0

-   switch to versioning same as server
