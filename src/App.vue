<template>
  <div id="app">
    <gol
    ></gol>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Gol from '@/Gol.vue'

export default Vue.extend({
  name: 'app',
  components: {
    Gol
  },
  props: {
    size: {
      type: Number,
      required: false,
      default: 10
    }
  },
  computed: {
    halfSize (): number {
      return this.size / 2
    }
  }
})
</script>

<style>
</style>
