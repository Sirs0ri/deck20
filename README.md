# Deck20

Use "Helden Software" characters in Roll20, add DSA related helpers like a calendar, connect your Stream Deck to Roll20, and more!

![A collage of three screenshots from this browser extension for the tabletop RPG "Das Schwarze Auge". The UI is in German. Screen 1 shows a timeline of skill checks, listing the skill's name and additional info: how successful it was, and when it happened. At the bottom you can see a hint of what the roll would have looked like in roll20's chat system. Screen 2 contains a calendar of the fictional world we're playing in, with one day marked as "today". A mouse cursor is hovering over one of the days and reveals more info, like the week day "Praiostag" and the current moon phase "Helm". Screen 3 shows a list of the skills my character "Kilho" has, sorted in groups. There's a "floating action button" in the bottom right that looks like a stack of papers, that can be used to switch between characters.](https://user-images.githubusercontent.com/6765536/206564542-bb7c9327-d272-4734-be84-0c8605f2a453.png "A collage of three screenshots from this browser extension for the tabletop RPG \"Das Schwarze Auge\". The UI is in German. Screen 1 shows a timeline of skill checks, listing the skill's name and additional info: how successful it was, and when it happened. At the bottom you can see a hint of what the roll would have looked like in roll20's chat system. Screen 2 contains a calendar of the fictional world we're playing in, with one day marked as \"today\". A mouse cursor is hovering over one of the days and reveals more info, like the week day \"Praiostag\" and the current moon phase \"Helm\". Screen 3 shows a list of the skills my character \"Kilho\" has, sorted in groups. There's a \"floating action button\" in the bottom right that looks like a stack of papers, that can be used to switch between characters.")


---

**Table of Contents**

* [About this project](#about-this-project)
  * [Usage](#usage)
  * [Known Issues](#known-issues)
* [Development](#development)
  * [Getting started](#getting-started)
  * [Modes: SPA vs BEX](#modes)
* [Other / Attributions](#other--attributions)

---



## About this project
This is a side-project, developed when I have some free time. Use at your own risk. It currently supports Chrome, and should work on other chromium-based browsers (tested on Chrome Beta).

The main goal of this browser extension is to make playing the German TTRPG "Das Schwarze Auge" (The Dark Eye, version 4.1) on Roll20 a smoother experience. Its core features are currently:

**Automatic roll generation from imported charactersheets:** 

This browser extension lets you import charactersheets created via the tool [Helden Software](https://www.helden-software.de/), and will offer you multiple ways to perform rolls for a character's attributes and talents:
* On the "Charactere" page, click the (20) icon next to an attribute/talent.
* In Roll20, type `/t` to start a talent roll or `/ew` to roll on an attribute, then use the autocomplete options to select the specific roll, resulting in a command like so: `/t Sinnenschärfe` or `/ew Charisma`.
* You can use complete `/t` or `/ew` commands inside macros too. This can be useful for talents you use often.

For either option, you'll be prompted for a modifier in Roll20. After entering the modifier, the roll will be sent to the chat. All rolls performed by this extension use Roll20's internal random number generator, this extension only makes it *easier* to perform the rolls.

Additionally, all rolls from either of those methods will be recorded and will be listed on the rolls page in the extension. In the future I'm planning to add some analytics, so that you could see for example what your most rolled talent was, or which talents could be improved.

**A calendar for DSA's fictional world "Aventurien":**

DSA has a couple of adventures and classes where the current date, and the phase of the moon play an important role. This extension includes a calendar tool based on the wonderful "[DSA Datums Rechner](https://www.unix-ag.uni-kl.de/~t_schmid/dsacal/)", but with a much improved usability. This extension can remember the current date of your campaign (CTRL + doubleclick on any day to set it as *today*), and supports a much quicker navigation via the mouse: Scroll over the month view to jump between months, or scroll sideways to jump forwards/backards a whole year. The information being displayed when hovering a day also makes it very easy to find e.g. the next full moon!

I have plans to offer an interface between the current date and rolls, which would be especially useful for ritual casting, which often has a modifier based on the current moon phase. See [issue #8](https://github.com/Sirs0ri/deck20/issues/8).

**Improvements for Roll20's chat autocomplete function:**

Roll20 comes with a couple of [chat commands](https://wiki.roll20.net/Complete_Guide_to_Macros_%26_Rolls#Chat_Commands) players can use, but they can be hard to remember. This browser extension improves the autocomplete functionality of the chat by showing a list of all available commands when the user types `/`, and it adds a better experience to the built in `/fx` command. Additionally, all commands added by this extension make use of the autocomplete functionality with an improved search, so that you could for example type `/t kunde` , and you'd find all talents tat include the term "kunde", such as "Menschenkunde", "Pflanzenkunde", etc.

**(Optional) A local API to interact with an open Roll20 tab from external services/devices:**

One of the motivations for this project was that I wanted to a) be able to trigger events on Roll20 via my Elgato Stream Deck, and b) learn how to build a browser extension that utilizes the [Native Messaging API](https://developer.chrome.com/docs/apps/nativeMessaging/). This repository comes with a small webserver that will forward messages to the browser extension, which in turn can communicate with Roll20. For more info see [src-native-bridge/readme.md](https://github.com/Sirs0ri/deck20/blob/main/src-native-bridge/readme.md). This feature is completely optional, and has to be enabled manually.

### Usage

Grab the [zipped extension](https://github.com/Sirs0ri/deck20/releases/latest/download/Packaged.deck20.zip) from the latest release, and install it as an "unpacked extension". A guide on how to do that in Chrome can be found [here](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).

You should now see a d20 icon in your extensions!

### Known issues

**My Data doesn't load**

*Indicators*: The Calendar doesn't load, previously saved Characters aren't restored.

*Underlying issue*: Chrome currently has a bug where parts of an extension (the service worker) aren't properly restarted after the extension's updated. See [this issue](https://bugs.chromium.org/p/chromium/issues/detail?id=1271154#c52).

*Solutions*:
  * The simple one: Restart your browser.
  * The advanced one: Restart the extension's Service Worker. In one of the views of the extensions, open the devtools, and hit "update" in the "Application" tab, under "Service Workers"

---



## Development

If you think this extension is missing important features, or you found a bug, you can report that by [opening a new issue](https://github.com/Sirs0ri/deck20/issues/new) in this repository. If you want to try and figure out a solution on your own, keep reading!

This project is built with the Vue.js based framework [Quasar](https://quasar.dev/introduction-to-quasar). If you're famailiar with Vue.js, you should become familiar with Quasar bretty quickly!

### Getting started

As with every Node.js project, you're going to have to install some dependencies to get started:
```bash
yarn install
```

### Modes
This extension can be ran locally in two different modes: SPA and BEX. 

SPA (Single Page Application) mode is helpful to work on the UI, but it will neither store data between page reloads, not will it connect to the content injected into Roll20. It has however HMR (hot module reloading) support to automatically refresh updated components, and the Vue Devtools work with it.

BEX (Browser EXtension) mode *will* store data and connect to Roll20 just fine, but you lose the ability to use Vue Devtools and HMR. Also, due to Vite's current configuration you'll probably have to restart the bex dev-mode a fair amount of times, since the dev mode fails if Vite encounters (linter) errors in the code. Note: The roll-recording featrue of this extension differentiates between rolls recorded with a "debugging" build, like you'd get it from the following command, and "full" builds as described in the "Build the app" section below. A full build will ignore rolls recorded with a debugging build.

To start the app in development mode (hot-module reloading, error reporting, etc.), use one of these commands:

```bash
# SPA mode:
quasar dev
# or BEX mode:
quasar dev -m bex
```


### Lint the files
This project comes with a bundled config for ESlint. To make sure all code followes the same style guidelines, use the following lint command. Alternatively, a lot of modern IDEs let you lint the code automatically, e.g. when you save a file.

```bash
yarn lint
```

### Build the app for production
If you want to create a "build" of the application, use this command. There are a few parts of the application that recognise when they're running in a debugging environment, or as a full build. For example, rolls recorded with a debugging version of this extension will not show up when you're using a full build.

```bash
quasar build -m bex
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

---



## Other // Attributions

Main App Icon: ["Icosahedron free icon" by Freepik - Flaticon](https://www.flaticon.com/free-icon/icosahedron_6181197)
