<template>
  <div>
    <webgl-gol />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import GolPreview from '@/components/GolPreview.vue'
// import GolBoard from '@/components/GolBoard.vue'
// import ThreeGol from '@/components/ThreeGol.vue'
import WebglGol from '@/components/WebglGol.vue'

export default Vue.extend({
  name: 'app',
  components: {
    // GolBoard,
    // GolPreview,
    // ThreeGol,
    WebglGol
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
