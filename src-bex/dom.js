// Hooks added here have a bridge allowing communication between the Web Page and the BEX Content Script.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/dom-hooks
import { bexDom } from "quasar/wrappers"

const log = (...args) => console.log("[bex] dom", ...args)

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

  log("active", Date.now())

  const chat = await getChat()

  // React to forwarded messages from the content script
  // bridge.on("do-dom-manipulation", async evt => {
  //   log("got do-dom-manipulation")
  //   // (await chat).doChatInput("/w Max Hello there!")
  //   evt.respond()
  // })
  bridge.on("forwarded-comm", async evt => {
    log("got forwarded-comm", evt.data);
    (await chat).doChatInput(`/w Max ${JSON.stringify(evt.data)}`)
    evt.respond()
  })

  log("Chat connected")

  /*
  bridge.send('message.to.quasar', {
    worked: true
  })
  */
})
