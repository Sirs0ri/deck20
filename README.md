# Deck20

Connect Roll20 to a Stream-Deck, and add some DSA related helpers, like a calendar, or parsing of a "Helden Software" character sheet from XML

![A collage of three screenshots from this browser extension for the tabletop RPG "Das Schwarze Auge". The UI is in German. Screen 1 shows a timeline of skill checks, listing the skill's name and additional info: how successful it was, and when it happened. At the bottom you can see a hint of what the roll would have looked like in roll20's chat system. Screen 2 contains a calendar of the fictional world we're playing in, with one day marked as "today". A mouse cursor is hovering over one of the days and reveals more info, like the week day "Praiostag" and the current moon phase "Helm". Screen 3 shows a list of the skills my character "Kilho" has, sorted in groups. There's a "floating action button" in the bottom right that looks like a stack of papers, that can be used to switch between characters.](https://user-images.githubusercontent.com/6765536/206564542-bb7c9327-d272-4734-be84-0c8605f2a453.png)

## Disclaimer

This extension is a side-project, developed when I have some free time. Use at your own risk. It currently supports Chrome, and should work on chromium-based browsers.

## Usage

Grab the [zipped extension](https://github.com/Sirs0ri/deck20/releases/latest/download/Packaged.deck20.zip) from the latest release.

Install it as an "unpacked extension". A guide on how to do that in chrome can be found [here](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).

You should now see a d20 icon in your extensions!

### Known issues

**My Data doesn't load**

*Indicators*: The Calendar doesn't load, previously saved Characters aren't restored.
*Underlying issue*: Chrome currently has a bug where parts of an extension (the service worker) aren't properly restarted after the extension's updated. See [this issue](https://bugs.chromium.org/p/chromium/issues/detail?id=1271154#c52).
Solutions:
  * The simple one: Restart your browser.
  * The advanced one: Restart the extension's Service Worker. In one of the views of the extensions, open the devtools, and hit "update" in the "Application" tab, under "Service Workers"

## Development

## Install the dependencies
```bash
yarn
```

## Modes
This extension can be ran locally in two different modes: SPA and BEX. 

SPA mode is helpful to build UI, but it will neither store data between page reloads, not will it connect to the content injected into Roll20. It however has HMR support to automatically refresh updated components, and the Vue Devtools work with it.

BEX (Browser EXtension) mode *will* store data and connect to Roll20 just fine, but you lose the ability to use Vue Devtools and HMR. Also, due to Vite's current configuration you'll probably have to restart the bex dev-mode a fair amount of times, since the dev mode fails if Vite encounters (linter) errors in the code.
### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
# SPA mode:
quasar dev
# or BEX mode:
quasar dev -m bex
```


### Lint the files
```bash
yarn lint
```



### Build the app for production
```bash
# SPA mode:
quasar build
# or BEX mode:
quasar build -m bex
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

# Other // Attributions

Main App Icon: ["Icosahedron free icon" by Freepik - Flaticon](https://www.flaticon.com/free-icon/icosahedron_6181197)
