# Changelog

## v4.0.3

- avatar editor

## v4.0.0

- use IBM Plex Sans as font

## v3.5.0

- migrate to tailwindcss

## v3.4.0

- filter swear words option
- block users (alpha)

## v2.8.1

- add support for facebook and instagram
- allow images for maximum 800px height

## v2.8.0

- upgrade to metahkg-api v2.8.0

## v2.5.10

- service worker (alpha)

## v2.5.9

- fixed conversation (scroll and pagify)
- mode-based menu, more simple
- disable and enable menu before loading the components
- general fixes

## v2.5.8

- synchronized search bars
- sync query to url
- record last query

## v2.5.7

- re-fix the images on mobile devices by disabling display inline-block on condition

## v2.5.6

- fix the swipeable view feature (rewrite)

## v2.5.5

- swipeable views for menu

## v2.5.4

- fix the white space above and below images on mobile devices (new comments only, old comments still have this issue)
- reload after the token is removed because of expiration

## v2.5.3

- add a circular loader for profile and gallery
- add an upload images button in tinymce (so users don't need to use images plugin and click three buttons)
- allow users to resize images, small and normal, in quotes it is small by default

## v2.5.2

- link preview only if the href match the text

## v2.5.1

- add link preview

## v2.5.0

- improved the floating editor (bottom toolbar, removed menubar and statusbar)
- remove upload image button in favor of implementing the functionality in the photo plugin of tinymce
- configure image styles using content css in tinymce, setContent not needed
- deprecate votebar which doesn't work well with replies button
- vote buttons can now update the global state
- remove the addcomment page, as all comments now use the floating editor

## v2.4.0

- metahkg-web can now be used as a module
- removed /profile/self
- remove change of gender

## v2.2.0

- switch to versioning same as server
