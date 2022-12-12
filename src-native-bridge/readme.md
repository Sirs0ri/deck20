# Native Bridge

One of the goals with this extension for me personally was to find a way to talk to Roll20 "from the outside". This browser extension comes with an optional "native host" that opens a local web server while a Roll20 tab is open, which you can use to send messages to Roll20.

This feature is fully optional, and has to be enabled manually, by registering a "native host" with the ID `de.sirs0ri.deck20`. 

The full documentation can be found [here](https://developer.chrome.com/docs/apps/nativeMessaging/#native-messaging-host-location), for Windows you'd have to register the path to the `src-native-bridge/manifest.json` file (not the manifest file found at `src-bex/manifest.json`!) at the following registry key:

```HKEY_CURRENT_USER\SOFTWARE\Google\Chrome\NativeMessagingHosts\de.sirs0ri.deck20```

The web server will automatically start when the browser extension connects to a Roll20 tab, and close when the last Roll20 tab is closed. It is available at localhost:8000 and will accept POST requests. As an example, I'm using the following JSON-payload to roll a d20 from my Stream Deck (via the [API Request](https://apps.elgato.com/plugins/com.github.mjbnz.sd-api-request) plugin):

```JSON
{
  "command": "send-message",
  "data": { 
    "msg": "/r 1d20"
  }
}
```