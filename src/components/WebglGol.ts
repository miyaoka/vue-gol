import Vue from 'vue'
import GlUtil from '../lib/GlUtil'

import fgColor from '@/shaders/color.frag'
import fgRandom from '@/shaders/golRandom.frag'
import fgCopy from '@/shaders/golCopy.frag'
import fgProcess from '@/shaders/golProcess.frag'
import vert from '@/shaders/gol.vert'

const vertexCount = 10000
const vertices: number[] = []

let gl: GlUtil

export default Vue.extend({
  components: {},
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
    const canvas = this.$refs.canvas as HTMLCanvasElement
    let cx = canvas.getContext('webgl')
    if (!cx) return

    // gl
    gl = new GlUtil(cx)
    cx.viewport(0, 0, this.w, this.h)
    cx.clearColor(1, 1, 0.9, 1)

    // shaders
    gl.linkProgram(vert, fgColor).use()

    // vert

    let count = vertexCount
    while (count-- > 0) {
      vertices.push(Math.random() * 2 - 1)
      vertices.push(Math.random() * 2 - 1)
    }

    const buffer = cx.createBuffer()
    cx.bindBuffer(cx.ARRAY_BUFFER, buffer)
    cx.bufferData(cx.ARRAY_BUFFER, new Float32Array(vertices), cx.DYNAMIC_DRAW)

    const pos2d = gl.getAttribLocation('pos2d')
    cx.vertexAttribPointer(pos2d, 2, cx.FLOAT, false, 0, 0)
    cx.enableVertexAttribArray(pos2d)

    const size = gl.getAttribLocation('size')
    cx.vertexAttrib1f(size, 2)

    cx.uniform4f(gl.getUniformLocation('color'), 1, 0.5, 0, 1)

    this.play()
  },
  watch: {
    x (val: number): void {
      gl.context.vertexAttrib1f(gl.getAttribLocation('size'), val)
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
      const cx = gl.context
      cx.bufferSubData(cx.ARRAY_BUFFER, 0, new Float32Array(vertices))

      cx.clear(cx.COLOR_BUFFER_BIT)
      cx.drawArrays(cx.POINTS, 0, vertexCount)
    }
  },
  filters: {
    playbutton (isPlaying: boolean) {
      return isPlaying ? '■ stop' : '▶ play'
    }
  }
})
