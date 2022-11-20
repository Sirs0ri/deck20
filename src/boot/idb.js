import { openDB } from "idb"

import { TABLE_NAME_ROLLS } from "src/utils/constants"
import packageInfo from "../../package.json"

console.log("DB opened via bootfile")

const DB_VERSION = 1
const dbName = packageInfo.name
const tables = [TABLE_NAME_ROLLS]
const dbPromise = openDB(dbName, DB_VERSION, {
  upgrade (db) {
    console.log("Upgrading DB...")

    // Delete old stores no longer needed
    for (const store of db.objectStoreNames) {
      if (!tables.includes(store)) {
        console.log("Deleting store", store, "...")
        db.deleteObjectStore(store)
      }
    }

    // Add new stores that don't exist yet
    for (const table of tables) {
      if (!db.objectStoreNames.contains(table)) {
        console.log("Creating table", table, "...")

        switch (table) {
          case TABLE_NAME_ROLLS: {
            const store = db.createObjectStore(table, {
              keyPath: "msgData.id",
              autoIncrement: false,
            })
            store.createIndex("date", "msgData.realtimestamp", { unique: false })
            break
          }

          default:
            db.createObjectStore(table, {
              keyPath: "id",
              autoIncrement: false,
            })

            break
        }
      }
    }
  },
})

// export default async ({ app }) => {
//   // Set i18n instance on app
//   app.$dbPromise = dbPromise
// }

export { dbPromise }
