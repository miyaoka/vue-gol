<template>
  <div>
    <wgl-gol-wrapper />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import GolPreview from '@/components/GolPreview.vue'
// import GolBoard from '@/components/GolBoard.vue'
// import ThreeGol from '@/components/ThreeGol.vue'
import WglGolWrapper from '@/components/WglGolWrapper.vue'

export default Vue.extend({
  name: 'app',
  components: {
    // GolBoard,
    // GolPreview,
    // ThreeGol,
    WglGolWrapper
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
})
</script>

<style>
</style>
