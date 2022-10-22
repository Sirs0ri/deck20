#!/usr/local/bin/node

// ========== Bridge between BEX / Anything else ==========
// This node.js script serves as a bridge between the browser extension in
// src-bex/ and 3rd party apps. It connects to the BEX via the nativeMessaging
// protocol, meaning Chrome starts it when the BEX wants to connect, and stops
// it when the last connection has ended.
// This script opens a webserver on port localhost:8000 via express, which will
// listen to POST requests and forward them to the BEX.

// const fs = require("fs")
// const path = require("path")

const express = require("express")

const host = "localhost"
const port = 8000

// Use this to create a log file:
const log = (args) => {
  // if (!fs.existsSync(path.resolve(__dirname, "message.txt"))) {
  //   const data = new Uint8Array(Buffer.from(""))
  //   fs.writeFileSync(path.resolve(__dirname, "message.txt"), data)
  // }

  // if (args instanceof Array) {
  //   for (const arg of args) {
  //     const data = new Uint8Array(Buffer.from(`${arg}\n`))
  //     fs.appendFileSync(path.resolve(__dirname, "message.txt"), data)
  //   }
  // } else if (args) {
  //   const data = new Uint8Array(Buffer.from(`${args}\n`))
  //   fs.appendFileSync(path.resolve(__dirname, "message.txt"), data)
  // }
}

const sendData = msg => {
  if (typeof msg !== "string") {
    msg = JSON.stringify(msg)
  }
  const header = Buffer.alloc(4)
  header.writeUInt32LE(msg.length, 0)

  process.stdout.write(header)
  process.stdout.write(msg)
}

(() => {
  log(`Opening log at ${new Date()}...`)

  const app = express()

  app.use(express.json()) // for parsing application/json

  // The GET endpoint serves as a basic status page. It's either unavailable,
  // or it serves {success: true}.
  app.get("/", function (req, res) {
    res.json({ success: true })
  })

  // The POST endpoint takes data posted to it, and forwards them to the BEX
  // via the nativeMessaging protocol.
  app.post("/", function (req, res) {
    log("POST /")
    log(JSON.stringify(req.body))

    sendData(req.body)
    res.json({ success: true })
  })

  app.listen(port)
  log(`Server is running on http://${host}:${port}`)

  let payloadSize = null

  // A queue to store the chunks as we read them from stdin.
  // This queue can be flushed when `payloadSize` data has been read
  const chunks = []

  // Only read the size once for each payload
  const sizeHasBeenRead = () => Boolean(payloadSize)

  // All the data has been read, reset everything for the next message
  const flushChunksQueue = () => {
    payloadSize = null
    chunks.splice(0)
  }

  // Process data coming from the BEX - only does logging for now.
  const processData = () => {
    // Create one big buffer with all the chunks
    const stringData = Buffer.concat(chunks)

    // The browser will emit the size as a header of the payload,
    // if it hasn't been read yet, do it.
    // The next time we'll need to read the payload size is when all of the data
    // of the current payload has been read (i.e. data.length >= payloadSize + 4)
    if (!sizeHasBeenRead()) {
      payloadSize = stringData.readUInt32LE(0)
    }

    // If the data we have read so far is >= to the size advertised in the header,
    // it means we have all of the data sent.
    // We add 4 here because that's the size of the bytes that hold the payloadSize
    if (stringData.length >= (payloadSize + 4)) {
      // Remove the header
      const contentWithoutSize = stringData.slice(4, (payloadSize + 4))

      // Reset the read size and the queued chunks
      flushChunksQueue()

      // const json = JSON.parse(contentWithoutSize)

      // Do something with the data…
      log(contentWithoutSize)

      // sendData({ text: "Hello, BEX" })
    }
  }

  // Read from STDIN, since this is how nativeMessaging will talk to this app.
  process.stdin.on("readable", () => {
    // A temporary variable holding the nodejs.Buffer of each
    // chunk of data read off stdin
    let chunk = null

    // Read all of the available data
    while ((chunk = process.stdin.read()) !== null) {
      chunks.push(chunk)
    }

    processData()
  })

  process.on("SIGTERM", () => {
    process.exit()
  })

  process.on("SIGINT", () => {
    process.exit()
  })

  process.on("exit", () => {
    log("exiting")
  })
})()
