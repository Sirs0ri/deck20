// Hooks added here have a bridge allowing communication between the Web Page and the BEX Content Script.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/dom-hooks
import { bexDom } from 'quasar/wrappers'

const log = (...args) => console.log('[bex] dom', ...args)

async function getChat () {
  const playerPromise = new Promise((resolve) => {
    const interval = setInterval(() => {
      const isLoaded = window.currentPlayer?.d20?.textchat?.chatstartingup === false
      if (isLoaded) {
        clearInterval(interval)
        resolve(window.currentPlayer.d20.textchat)
      }
    }, 100)
  })

  return await playerPromise
}

export default bexDom(async (bridge) => {
  // This runs in the context of a tab with an allowlisted origin
  // This can talk to the local content script.
  // This cannot talk to anything else.

  log('active', Date.now())

  const chat = getChat()

  bridge.on('do-dom-manipulation', async evt => {
    log('got do-dom-manipulation');
    (await chat).doChatInput('/w Max Hello there!')
    evt.respond()
  })

  bridge.on('hello-dom', (evt) => {
    log('received hello from', evt.data)
    evt.respond()
  })

  setTimeout(() => {
    bridge.send('hello-bg', 'dom')
    bridge.send('hello-content', 'dom')
    bridge.send('hello-ui', 'dom')
  }, 500)

  // bridge.send('test', 'dom')

  // bridge.on('extension_icon_clicked', ({ data, respond }) => {
  //   log('Extension icon clicked!')
  //   respond()
  // })
  // bridge.on('frontend_icon_clicked.bg', ({ data, respond }) => {
  //   log('Frontend icon clicked!')
  //   respond()
  // })

  log('BEX Injected')

  getChat().then(() => {
    log('Chat connected')
  })

  /*
  bridge.send('message.to.quasar', {
    worked: true
  })
  */
})
