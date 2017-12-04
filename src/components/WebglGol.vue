<template>
  <div>
    <div>
      <button
        @click="togglePlay"
      >{{isPlaying | playbutton}}</button>
      <input type="range" v-model.number="x" min="1" max="10" step="any">
      {{x.toFixed(1)}}
    </div>

    <canvas
      ref="canvas"
      :width="w"
      :height="h"
    ></canvas>
  </div>
</template>

<script lang="ts" src="./WebglGol">
</script>

<style>
</style>
