<template>
  <rect
    rx="10" ry="10"
    :width="size"
    :height="size"
    stroke="black"
    :stroke-width="0"
    :fill="state ? 'black' : 'transparent'"
    @mousedown="onMouseDown"
    @mouseover="onMouseOver"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'GolCell',
  data () {
    return {
    }
  },
  props: {
    i: { type: Number },
    size: { type: Number, required: true, default: 10 },
    state: { type: Number }
  },
  methods: {
    onMouseDown () {
      this.$emit('mousedown', this.i)
    },
    onMouseOver () {
      this.$emit('mouseover', this.i)
    }
  }
})

</script>

<style scoped>
</style>
