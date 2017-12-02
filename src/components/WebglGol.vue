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
import frag from '@/shaders/shader.frag'
import vert from '@/shaders/shader.vert'

let gl: WebGLRenderingContext
let sp: WebGLProgram | null
const vertexCount = 100000
const vertices: number[] = []

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
    gl = context
    gl.viewport(0, 0, this.w, this.h)
    gl.clearColor(1, 1, 0.9, 1)

    // shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, vert)
    gl.compileShader(vs)

    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, frag)
    gl.compileShader(fs)

    sp = gl.createProgram()
    gl.attachShader(sp, vs)
    gl.attachShader(sp, fs)
    gl.linkProgram(sp)
    gl.useProgram(sp)

    // vert

    let count = vertexCount
    while (count-- > 0) {
      vertices.push(Math.random() * 2 - 1)
      vertices.push(Math.random() * 2 - 1)
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW)


    const coords = gl.getAttribLocation(sp, 'coords')
    gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(coords)

    const pointSize = gl.getAttribLocation(sp, 'pointSize')
    gl.vertexAttrib1f(pointSize, 1)

    const color = gl.getUniformLocation(sp, 'color')
    gl.uniform4f(color, 0, 0, 0, 1)


    // gl.vertexAttrib3f(
    //   gl.getAttribLocation(sp, 'coords'),
    //   0, 0, 0
    // )

    // gl.vertexAttrib1f(
    //   gl.getAttribLocation(sp, 'pointSize'),
    //   300
    // )

    // gl.uniform4f(
    //   gl.getUniformLocation(sp, 'color'),
    //   1, 0.9, 0.9, 1
    // )

    this.play()
  },
  watch: {
    x (val: number): void {
      gl.vertexAttrib3f(
        gl.getAttribLocation(sp, 'coords'),
        val, 0, 0
      )
    }
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
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices))

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, vertexCount)
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
