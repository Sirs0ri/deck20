// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks

import { bexContent } from 'quasar/wrappers'

const log = (...args) => console.log('[bex] content', ...args)

export default bexContent((bridge) => {
  // This runs in the context of a tab with an allowlisted origin
  // This can talk to background.js
  // This is the only one being able to talk to the local dom.js

  log('content script active', Date.now())

  bridge.on('forwarded-ui-action', async evt => {
    log('got forwarded-ui-action, pinging dom')
    bridge.send('do-dom-manipulation')
    evt.respond()
  })

  bridge.on('hello-content', (evt) => {
    log('received hello from', evt.data)
    evt.respond()
  })

  setTimeout(() => {
    bridge.send('hello-ui', 'content')
    bridge.send('hello-dom', 'content')
    bridge.send('hello-bg', 'content')
  }, 500)
})
