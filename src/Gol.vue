<template>
  <div>
    <three-gol />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GolPreview from '@/components/GolPreview.vue'
import GolBoard from '@/components/GolBoard.vue'
import ThreeGol from '@/components/ThreeGol.vue'

export default Vue.extend({
  name: 'app',
  components: {
    GolBoard,
    GolPreview,
    ThreeGol
  },
  data () {
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
