<template>
  <div
    :style="`background: #34495E; height: ${h * scale}px; width: ${w * scale}px;`"
  >
    <canvas
      ref="canvas"
      :width="w"
      :height="h"
      :style="`transform: scale(${scale}, ${scale});`"
    ></canvas>
  </div>
</template>

<script lang="ts" src="./WglGol">
</script>

<style scoped>
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
