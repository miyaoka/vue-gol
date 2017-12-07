<template>
  <div>
    <wgl-gol />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import GolPreview from '@/components/GolPreview.vue'
// import GolBoard from '@/components/GolBoard.vue'
// import ThreeGol from '@/components/ThreeGol.vue'
import WglGol from '@/components/WglGol.vue'

export default Vue.extend({
  name: 'app',
  components: {
    // GolBoard,
    // GolPreview,
    // ThreeGol,
    WglGol
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
