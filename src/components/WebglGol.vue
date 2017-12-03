<template>
  <div>
    <div>
      <button
        @click="togglePlay"
      >{{isPlaying | playbutton}}</button>
      <input type="range" v-model.number="x" min="-1" max="1" step="any">
    </div>

    <canvas
      ref="canvas"
      :width="w"
      :height="h"
    ></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import frag from '@/shaders/golRandom.frag'
import fgCopy from '@/shaders/golCopy.frag'
import fgProcess from '@/shaders/golProcess.frag'
import vert from '@/shaders/gol.vert'
import { GlUtil, GlUtilProgram } from '@/lib/GlUtil'

const vertexCount = 100000
const vertices: number[] = []

let gu: GlUtil
let gup: GlUtilProgram

export default Vue.extend({
  components: {
  },
  data () {
    return {
      x: 1,
      w: 640,
      h: 480,
      animationId: 0
    }
  },
  created () {
    //
  },
  mounted () {
    const canvas = (this.$refs.canvas as HTMLCanvasElement)
    let context = canvas.getContext('webgl')
    if (!context) return

    // gl
    gu = new GlUtil(context)
    gu.gl.viewport(0, 0, this.w, this.h)
    gu.gl.clearColor(1, 1, 0.9, 1)

    // shaders
    gup = gu.makeProgram(vert, frag)

    // vert

    let count = vertexCount
    while (count-- > 0) {
      vertices.push(Math.random() * 2 - 1)
      vertices.push(Math.random() * 2 - 1)
    }

    const buffer = gu.gl.createBuffer()
    gu.gl.bindBuffer(gu.gl.ARRAY_BUFFER, buffer)
    gu.gl.bufferData(gu.gl.ARRAY_BUFFER, new Float32Array(vertices), gu.gl.DYNAMIC_DRAW)


    const pos = gup.getAttribLocation('pos')
    gu.gl.vertexAttribPointer(pos, 2, gu.gl.FLOAT, false, 0, 0)
    gu.gl.enableVertexAttribArray(pos)

    this.play()
  },
  watch: {
    // x (val: number): void {
    //   gu.gl.vertexAttrib3f(
    //     gu.gl.getAttribLocation(sp, 'coords'),
    //     val, 0, 0
    //   )
    // }
  },
  computed: {
    halfW (): number {
      return this.w / 2
    },
    halfH (): number {
      return this.h / 2
    },
    aspect (): number {
      return this.w / this.h
    },
    isPlaying (): boolean {
      return this.animationId !== 0
    }
  },
  methods: {
    play (): void {
      this.update()
    },
    update (): void {
      this.animationId = requestAnimationFrame(this.update)
      this.render()
    },
    stop (): void {
      cancelAnimationFrame(this.animationId)
      this.animationId = 0
    },
    togglePlay (): void {
      this.isPlaying ? this.stop() : this.play()
    },
    render (): void {
      for (let i = 0; i < vertexCount * 2; i += 2) {
        vertices[i] += Math.random() * 0.01 - 0.005
        vertices[i + 1] += Math.random() * 0.01 - 0.005
      }
      gu.gl.bufferSubData(gu.gl.ARRAY_BUFFER, 0, new Float32Array(vertices))

      gu.gl.clear(gu.gl.COLOR_BUFFER_BIT)
      gu.gl.drawArrays(gu.gl.POINTS, 0, vertexCount)
    }
  },
  filters: {
    playbutton (isPlaying: boolean) {
      return isPlaying ? '■ stop' : '▶ play'
    }
  }
})
</script>

<style>
</style>
