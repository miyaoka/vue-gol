<template>
  <div>
    <div>
      <input type="range" v-model.number="scale" min="0.1" max="4" step="any">
      {{scale.toFixed(1)}}
      <button
        @click="togglePlay"
      >{{isPlaying | playbutton}}</button>
    </div>

    <div
      :style="`height: ${h * scale}px; width: ${w * scale}px;`"
    >
      <canvas
        ref="canvas"
        :width="w"
        :height="h"
        :style="`transform: scale(${scale}, ${scale});`"
      ></canvas>
    </div>
  </div>
</template>

<script lang="ts" src="./WglGol">
</script>

<style>
canvas {
  transform-origin: top left;
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
  image-rendering: optimize-contrast;
  -ms-interpolation-mode: nearest-neighbor;
}
</style>
