<template>
  <q-page class="flex flex-center column">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    > -->

    <q-btn label="BEX" @click="onButtonClick">

    </q-btn>
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const log = (...args) => console.log('[bex] ui', ...args)

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const $q = useQuasar()

    // This can talk to background
    // There is no locally running content script, since it's not an allowlisted origin
    // There is no access to other content scripts.
    // There is no access to dom scripts
    function onButtonClick () {
      $q.bex.send('ui-called-action')
    }

    onMounted(() => {
      log('mounted')
    })

    return {
      onButtonClick
    }
  }

})
</script>
