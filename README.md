# Deck20

Connect Roll20 to a Stream-Deck, and add some DSA related helpers, like a calendar, or parsing of a "Helden Software" character sheet from XML

## Disclaimer

This extension is a side-project, developed when I have some free time. Use at your own risk. It currently supports Chrome, and should work on chromium-based browsers.

## Usage

Grab the [zipped extension](https://github.com/Sirs0ri/deck20/blob/release/bex/Packaged.deck20.zip) from the release/bex branch, or download that branch itself.

Install it as an "unpacked extension". A guide on how to do that in chrome can be found [here](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).

You should now see a d20 icon in your extensions!

## Development

## Install the dependencies
```bash
yarn
```

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
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

# Other // Attributions

Main App Icon: ["Icosahedron free icon" by Freepik - Flaticon](https://www.flaticon.com/free-icon/icosahedron_6181197)
