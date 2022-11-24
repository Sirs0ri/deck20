import { ref } from "vue"
import { defineStore } from "pinia"
import { uid as getUid } from "quasar"

import { dbPromise } from "src/boot/idb"
import { TABLE_NAME_ROLLS } from "src/utils/constants"
import { useBridge } from "src/utils/bexBridge"

const STORE_NAME = "rolls"

export const useRollsStore = defineStore(STORE_NAME, () => {
  const { bexSendBridged } = useBridge()

  // ========== STATE ==========
  const uid = getUid()

  async function addRoll (data) {
    const db = await dbPromise
    await db.put(TABLE_NAME_ROLLS, data)

    bexSendBridged("ui", "roll-persisted")
  }

  // #region ========== PERSISTENCE ==========
  const restored = ref(false)
  const restoration = ref(null)

  restoration.value = new Promise(resolve => { resolve(true) })
  restored.value = true

  // #endregion

  return {
    uid,
    restored,
    restoration,
    // rolls,
    addRoll,
  }
})
