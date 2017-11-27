<template>
  <div>
    <gol-board
      :cols="cols"
      :rows="rows"
      :play="play"
      :interval="50"
      ref="gol"
    ></gol-board>
    <div>
      <button
        @click="play = true"
      >start</button>
      <button
        @click="play = false"
      >stop</button>
      <button
        @click="onClickStep"
      >step</button>
    </div>
    <div>
      <button
        @click="onClickClear"
      >clear</button>
      <button
        @click="onClickRandom"
      >random</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GolBoard from '@/components/GolBoard.vue'

export default Vue.extend({
  name: 'app',
  components: {
    GolBoard
  },
  data: function () {
    return {
      cols: 100,
      rows: 50,
      size: 10,
      play: false
    }
  },
  computed: {
    gol (): any {
      return this.$refs.gol as any
    }
  },
  methods: {
    onClickStep () {
      this.play = false
      this.gol.step()
    },
    onClickClear () {
      this.play = false
      this.gol.clear()
    },
    onClickRandom () {
      this.gol.random()
    }
  }
})
</script>

<style>
</style>
