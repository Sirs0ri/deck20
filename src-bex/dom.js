// Hooks added here have a bridge allowing communication between the Web Page and the BEX Content Script.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/dom-hooks
import { bexDom } from "quasar/wrappers"
import { uid } from "quasar"

/** Wrapper for console.log that adds a "[bex] dom" prefix infront of the logged message
 *
 * @param  {...any} args
 */
const log = (...args) => {
  if (process.env.DEBUGGING) { console.log("[bex] dom:", ...args) }
}

/** Wait for the chat to be fully loaded. By default, wait for past messages to be loaded as well.
 * @param {Boolean} skipStartupCheck Return when the chat is initialized, without waiting for past messages
 * @returns a reference to the chat
 */
async function getChat (skipStartupCheck = false) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const chat = window.currentPlayer?.d20?.textchat
      if (!chat) return

      if (skipStartupCheck || !chat.chatstartingup) {
        clearInterval(interval)
        resolve(window.currentPlayer.d20.textchat)
      }
    }, 50)
  })
}

/** Wait for the chat to load, then inject a function into the process of
 * typing a message to retrieve autocomplete suggestions. The function will
 * receive the current message as argument.
 * If the new handler returns a non-empty array of items, these will be used
 * as suggestion and the chat message will not be forwarded to the original
 * handler. Each item can be either a string, or a {label, value} object
 *
 * @param {function(message)} func - Autocomplete Responder to be injected
 * @see https://api.jqueryui.com/autocomplete/#option-source
 */
async function injectChatAutocompleteResponder (func) {
  const chat = await getChat(true)
  const ogResponder = chat.$textarea.autocomplete("option", "source")

  function newResponder (request, respond) {
    func(request).then(response => {
      if (response?.length) respond(response)
      else ogResponder(request, respond)
    }).catch(() => {
      ogResponder(request, respond)
    })
  }

  window.d20.textchat.$textarea.autocomplete("option", "source", newResponder)
}

/** Wait for the chat to load, then inject a function into the process of
 * sending a message. The function will receive 4 arguments:
 * msg, src, callbackId, and an unknown 4th.
 * If the new handler returns true, the chat message will not be forwarded to
 * the original handler.
 *
 * @param {Function} func Function to be injected
 */
async function injectChatInputHandler (func) {
  const chat = await getChat(true)
  const ogHandler = chat.doChatInput

  function newHandler (msg, src = "chatbox", callbackId = undefined, arg4 = void 0) {
    // src: [chatbox, quickdice, charsheet]
    // callbackId: will be added as "listenerid" into the message. Additionally, there'll be a jQuery event with the handler "mancerroll:<callbackId>" on $(document)
    const stopProcessing = func(msg, src, callbackId, arg4)
    if (stopProcessing) return
    ogHandler(msg, src, callbackId, arg4)
  }

  window.currentPlayer.d20.textchat.doChatInput = newHandler
}

/** Send a chatmessage, wrapped as promise.
 *
 * @param {String} msg Message to be sent
 * @returns {Object} Roll20's chat object of the sent message
 */
async function doChatInputAsync (msg) {
  const uuid = uid()

  const chat = await getChat()
  const result = new Promise(resolve => {
    window.$(document).one(`mancerroll:${uuid}`, (_evt, msg) => { resolve(msg) })
  })
  chat.doChatInput(msg, "chatbox", uuid)
  return result
}

export default bexDom(async (bridge) => {
  // This runs in the context of a tab with an allowlisted origin
  // This can talk to the local content script.
  // This cannot talk to anything else.

  log("active", Date.now())

  // Await chat to be initialized
  getChat(true).then(chat => {
    // Set the chat autocomplete popup to show above the chat, instead of below
    chat.$textarea.autocomplete("option", "position", { my: "left bottom", at: "left top" })
    log("got early chat")
  })

  // Await chat being fully loaded
  getChat().then(chat => {
    log("Chat connected")
    chat.doChatInput("/talktomyself on")
  })

  // Inject new handlers
  function logChatMessage (msg, origin, callbackId, arg4) {
    log("new outgoing message:", `"${msg}" via "${origin}".`, "extra args:", callbackId, arg4)
  }
  injectChatInputHandler(logChatMessage)

  async function logAutocompleteQuery (query) {
    log("autocomplete query:", query)

    if (query.term.startsWith("/t")) {
      const msg = query.term.substring(2).toLowerCase().trim()
      return await bridgedMessage("ui", "query-talents", { msg }).then(data => {
        log("character:", data)
        return data.result
      })
    }
  }
  injectChatAutocompleteResponder(logAutocompleteQuery)

  // React to forwarded messages from the content script
  bridge.on("send-message", ({ data }) => {
    log("got a request to send a message:", data)
    doChatInputAsync(data.msg)
      .then(chatMsg => {
        if (!data._pathing) return

        const { uuid, src } = data._pathing

        const responseMsg = {
          command: `bridge-response.${uuid}`,
          data: {
            chatMsg,
            _pathing: {
              uuid,
              src: "dom",
              dst: src,
              lastFwd: "dom",
            },
          },
        }
        log("returning response", responseMsg)
        bridge.send("bridge-forward", responseMsg)
      })
  })

  async function bridgedMessage (dst, command, data = {}, timeout = -1) {
    return new Promise((resolve, reject) => {
      const uuid = uid()
      let off

      // Set up timeout, if necessary
      if (timeout >= 0) {
        setTimeout(() => {
          off && off()
          reject("Timeout")
        }, timeout)
      }

      // Set up handler for the answer
      const cb = ({ data }) => {
        bridge.off(`bridge-response.${uuid}`, cb)
        log("received response:", data)
        resolve(data)
      }
      bridge.on(`bridge-response.${uuid}`, cb)

      data._pathing = {
        uuid,
        src: "dom",
        dst,
        lastFwd: "dom",
      }

      // Send command
      bridge.send("bridge-forward", {
        command,
        data,
      })
    })
  }

  // #region ========== bridge forwarding ==========
  // Set up forwarding from background.js to dom.js
  // ui -> background -> content -> dom
  const CURRENT_BRIDGE_STEP = "dom"

  bridge.on("bridge-forward", ({ data }) => {
    // break, if a forwarded message has no pathing info
    if (!data.pathing) return

    const { src, dst, lastFwd, uuid } = data.pathing
    // break if we sent this message
    if (lastFwd === CURRENT_BRIDGE_STEP) return

    if (dst === CURRENT_BRIDGE_STEP) {
      log("executing", data)

      if (data.command.startsWith("bridge-response.")) {
        // forward the response, without caring about any response it might get.
        bridge.send(data.command, data.data)
        return
      }
      // do command, handle response
      const response = bridge.send(data.command, data.data)
      log(response)
      response
        .then(response => {
          const responseMsg = {
            command: `bridge-response.${uuid}`,
            data: response,
            pathing: {
              uuid,
              src: CURRENT_BRIDGE_STEP,
              dst: src,
              lastFwd: CURRENT_BRIDGE_STEP,
            },
          }
          log("returning response", responseMsg)
          bridge.send("bridge-forward", responseMsg)
        })
    }
  })
  // #endregion

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
