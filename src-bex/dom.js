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

  chat.$textarea.autocomplete("option", "source", newResponder)
}

/** Wait for the chat to load, then inject a function into the process of
 * sending a message. The function will receive 4 arguments:
 * msg, src, callbackId, and an unknown 4th.
 * If the new handler returns true, the chat message will not be forwarded to
 * the original handler.
 *
 * @param {Function} func Function to be injected
 */
async function injectChatSendHandler (func) {
  const chat = await getChat(true)
  const ogHandler = chat.doChatInput

  function newHandler (msg, src = "chatbox", callbackId = undefined, arg4 = void 0) {
    // src: [chatbox, quickdice, charsheet]
    // callbackId: will be added as "listenerid" into the message. Additionally, there'll be a jQuery event with the handler "mancerroll:<callbackId>" on $(document)
    func(msg, src, callbackId, arg4).then(stopProcessing => {
      if (!stopProcessing) ogHandler(msg, src, callbackId, arg4)
    })
  }

  chat.doChatInput = newHandler
}

/** Wait for the chat to load, then inject a function into the process of
 * handling an imcoming message.
 *
 * @param {Function} func Function to be injected
 */
async function injectChatIncomingHandler (func) {
  const chat = await getChat(true)
  const ogHandler = chat.incoming

  /**
   * Process an incoming chat message
   * @param {Boolean} isChatMsg true for player-sent messages, false for system messages
   * @param {Objhect} msg message-Object
   * @param  {...any} incArgs unknown
   */
  function newHandler (isChatMsg, msg, arg1 = undefined, arg2 = undefined) {
    func(isChatMsg, msg, arg1, arg2).then(stopProcessing => {
      if (!stopProcessing) ogHandler(isChatMsg, msg, arg1, arg2)
    })
  }

  chat.incoming = newHandler
}

/** Send a chatmessage, wrapped as promise.
 *
 * @param {String} msg Message to be sent
 * @returns {Object} Roll20's chat object of the sent message
 */
async function doChatInputAsync (msg, target) {
  const uuid = uid()

  const chat = await getChat()
  if (target === "MYSELF") target = (window.currentPlayer.attributes.displayname || "").split(" ")[0]

  if (target) msg = `/w ${target} ${msg}`

  const result = new Promise(resolve => {
    window.$(document).one(`mancerroll:${uuid}`, (_evt, msg) => { resolve(msg) })
  })
  chat.doChatInput(msg, "chatbox", uuid)
  return result
}

async function queryInputFromPlayer (title, defaultVal, asNumber = false) {
  log(title, defaultVal, asNumber)
  return new Promise((resolve, reject) => {
    const dialogHtml = `<div>
      <p style='font-size: 1.15em;'>
        <strong>${window.currentPlayer.d20.utils.strip_tags(title)}:</strong>
        <input type='${asNumber ? "number" : "text"}' style='width: 75px; margin-left: 5px;'>
      </p>
    </div>`

    const dialogEl = window.$(dialogHtml)

    const destroyAndResolve = (value) => {
      dialogEl.off()
      dialogEl.dialog("destroy").remove()

      if (!value) {
        reject()
        return
      }

      window.d20.textchat.$textarea.focus()
      if (asNumber) resolve(parseFloat(value))
      else resolve(value)
    }

    dialogEl.dialog({
      title: "Input Value",
      beforeClose () {
        return false
      },
      buttons: {
        Submit () {
          const value = dialogEl.find("input").val()
          destroyAndResolve(value)
        },
        Cancel () {
          destroyAndResolve()
        },
      },
    })

    dialogEl.on("keydown", "input, select", evt => {
      // Only react to ENTER press
      if (evt.which !== 13) return

      evt.stopPropagation()
      evt.preventDefault()
      const value = dialogEl.find("input").val()
      destroyAndResolve(value)
    })

    requestAnimationFrame(() => {
      if (defaultVal != null) dialogEl.find("input").val(defaultVal).select()
      else dialogEl.find("input").focus()
    })
  })
}

// async function showSystemMessageToLocalPlayer (msg) {
//   // This sends a chat message with the type "system".
//   // Alternatives are "rollresult", "gmrollresult", "whisper", "advancedroll", "emote"
//   // if the messageObj has a "messageid" attribute, there'll be a mancerroll: event. See doChatInputAsync above
//   const chat = await getChat()
//   const messageObj = {
//     who: "system",
//     type: "system",
//     content: msg,
//   }
//   chat.incoming(/* isChatMessage? */ false, /* message */ messageObj)
// }

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
    if (process.env.DEBUGGING) {
      chat.doChatInput("/talktomyself on")
    }
  })

  // Inject new handlers

  async function interceptAutocompleteQuery (query) {
    log("autocomplete query:", query)

    if (query.term.startsWith("/t")) {
      const msg = query.term.substring(2).toLowerCase().trim()
      return await bridgedMessage("ui", "query-talents", { filter: msg }).then(data => {
        log("character:", data)
        return data.result
      })
    }
  }
  injectChatAutocompleteResponder(interceptAutocompleteQuery)

  async function interceptSendChatMessage (msg, origin, callbackId, arg4) {
    log("new outgoing message:", `"${msg}" via "${origin}".`, "extra args:", callbackId, arg4)
    if (msg.startsWith("/t ")) {
      const talentName = msg.substring(2).toLowerCase().trim()
      log("Got a query for a talent roll:", talentName)

      // set up promises
      let talentData
      let attributeData
      let talent
      const dataRequest = bridgedMessage(
        "ui",
        "query-talents",
        { filter: talentName },
      )
        .then(async data => {
          talentData = data.result

          if (!talentData.length) return
          if (!talentData[0].talent) return

          talent = talentData[0].talent
          log("got a talent:", talent)

          attributeData = await bridgedMessage(
            "ui",
            "query-attributes",
            { filter: talent.attributes },
          )
            .then(d => d.result)

          log("got attributeData:", attributeData)
        })

      // Query modifier
      const mod = await queryInputFromPlayer("Erschwernis (+) oder Erleichterung (-)", 0, true)

      // await promises
      await dataRequest

      const attr0 = attributeData.find(a => a.attribute.short === talent.attributes[0]).attribute
      const attr1 = attributeData.find(a => a.attribute.short === talent.attributes[1]).attribute
      const attr2 = attributeData.find(a => a.attribute.short === talent.attributes[2]).attribute

      const attr0string = `${attr0.value} [${attr0.short}]`
      const attr1string = `${attr1.value} [${attr1.short}]`
      const attr2string = `${attr2.value} [${attr2.short}]`

      const maxValue = talent.value - mod
      const rollQuery = (maxValue < 0) ? `[[d20cs1cf20 + ${-maxValue}[mod-TaW]]]` : "[[d20cs1cf20]]"

      // TODO: gm roll state? Shouldn't be hard-coded...
      // Get character info from linked character?
      const message = `@{Kilho von Viekis Stamm|gm_roll_opt} \
&{template:default} \
{{name= ${talent.name} }} \
{{ TaW=  ${talent.value} }} \
{{ Mod= ${mod} }} \
{{ TaW*= [[ { ( ${Math.max(maxValue, 0)} [TaP*] - { ${rollQuery} - ( ${attr0string} ) , 0}kh1 - { ${rollQuery} - ( ${attr1string} ) , 0}kh1 - { ${rollQuery} - ( ${attr2string} ) , 0}kh1 ) , ( ${talent.value} + 0d1) }dh1 ]] }} \
{{ Wurf 1= $[[0]] vs ${attr0string} }} \
{{ Wurf 2= $[[1]] vs ${attr1string} }} \
{{ Wurf 3= $[[2]] vs ${attr2string} }}`

      doChatInputAsync(message).then(msgData => {
        log("result of the roll", msgData)

        const total = msgData.inlinerolls[3].results.total

        const toPersist = {
          talent,
          success: total >= 0,
          total,
          msgData,
        }

        bridgedMessage("ui", "persist-roll", toPersist)
      })

      // showSystemMessageToLocalPlayer(`<strong>${talent.name}</strong><br>
      //   TaW: ${talent.value} <br>
      //   ${attributeData.map(a => `${a.attribute.name} vs ${a.attribute.value}`).join("<br>")}
      //   <pre>${JSON.stringify(talent, null, 4)}</pre>`)
      return true
    }
    log("not handling it...")
  }
  injectChatSendHandler(interceptSendChatMessage)

  async function interceptIncomingChatMessage (isChatMsg, msg, ...incArgs) {
    console.log("incoming chat message:", isChatMsg, msg, ...incArgs)
  }
  injectChatIncomingHandler(interceptIncomingChatMessage)

  // React to forwarded messages from the content script
  bridge.on("send-message", ({ data }) => {
    log("got a request to send a message:", data)
    doChatInputAsync(data.msg)
      .then(chatMsg => { bridgedResponse(data._pathing, { chatMsg }) })
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

  function bridgedResponse (pathing, data) {
    if (!pathing) return

    const { uuid, src } = pathing

    const responseMsg = {
      command: `bridge-response.${uuid}`,
      data: {
        ...data,
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
  }

  bridge.on("query-tokens", ({ data }) => {
    log("getting tokens", data)

    let tokens = window.currentPlayer.d20.Campaign.characters.models.filter(c => c.attributes.controlledby === window.currentPlayer.attributes.id)

    tokens = tokens.map(t => t.attributes)

    bridgedResponse(data._pathing, { tokens })
  })

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
  //     playerid: currentPlayer.id,
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
