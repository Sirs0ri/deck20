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
  bridge.on("forwarded-comm", async ({ data, respond }) => {
    log("got forwarded-comm", data)
    switch (data.command) {
      case "do-message":
        (await chat).doChatInput(data.data)
        break

      default:
        break
    }
    respond()
  })

  log("Chat connected")

  // /** Send a message directly via to Firebase
  //  * @param {String} who Displayname of the sender
  //  * @param {String} content Content of the message
  //  * @param {String} type [general, whisper, system]
  //  */
  // // TODO: Avatar, Inlinerolls
  // function sendMessage (who, content, type) {
  //   const msg = {
  //     who,
  //     type,
  //     content,
  //     playerid: window.currentPlayer.id,
  //     avatar: "/users/avatar/3307558/30",
  //     inlinerolls: [],
  //   }
  //   const db = window.firebase.database().ref(`${window.campaign_storage_path}/chat`)
  //   const msgId = db.push().key
  //   db.child(msgId).setWithPriority(msg, window.firebase.database.ServerValue.TIMESTAMP)
  // }

  // function processRoll (expression) {
  //   return new Promise((resolve, reject) => {
  //     // Roll20's dice engine
  //     const engine = window.currentPlayer.d20.textchat.diceengine
  //     // Callbacks
  //     const onSuccess = (results, rollid, signature) => {
  //       resolve({ expression, results, rollid, signature })
  //     }
  //     const onError = (err) => reject(err)
  //     // Do the roll - parse and execute the expression
  //     engine.process(
  //       expression,
  //       onSuccess,
  //       onError,
  //     )
  //   })
  // }
  // const rolls = await processRoll("2d20")
})
