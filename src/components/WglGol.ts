import Vue from 'vue'
import Wgl, { Program, Buffer, Texture, Framebuffer } from '../lib/Wgl'

import fgColor from '@/shaders/color.frag'
import fgRandom from '@/shaders/golRandom.frag'
import fgCopy from '@/shaders/golCopy.frag'
import fgProcess from '@/shaders/golProcess.frag'
import vert from '@/shaders/gol.vert'

const vertexCount = 10000
const vertices: number[] = []

let wgl: Wgl
let programs: { [key: string]: Program }
let buffers: { [key: string]: Buffer }
let textures: { [key: string]: Texture }
let framebuffers: { [key: string]: Framebuffer }

interface IArray {
  length: number
}

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
  // created () {},
  mounted () {
    try {
      wgl = Wgl.initFromCanvas(this.$refs.canvas as HTMLCanvasElement)
    } catch (err) {
      console.error(err)
      return
    }
    const cx = wgl.context
    cx.clearColor(1, 1, 0.9, 1)

    const a = new Float32Array([ 1, 2, 3 ]) as IArray
    console.log(a.length)

    const scale = 4
    const viewSize = new Float32Array([ this.w, this.h ])
    const stateSize = new Float32Array([ this.w / scale, this.h / scale ])

    // shaders
    programs = {
      copy: wgl.createProgram(vert, fgCopy),
      gol: wgl.createProgram(vert, fgProcess)
    }
    buffers = {
      quad: wgl.createArrayBuffer().update(Wgl.QUAD2)
    }
    textures = {
      front: wgl.createTexture(cx.RGBA, cx.REPEAT, cx.NEAREST).blank(stateSize[0], stateSize[1]),
      back: wgl.createTexture(cx.RGBA, cx.REPEAT, cx.NEAREST).blank(stateSize[0], stateSize[1])
    }
    framebuffers = {
      step: wgl.createFramebuffer()
    }

    // // vert
    // let count = vertexCount
    // while (count-- > 0) {
    //   vertices.push(Math.random() * 2 - 1)
    //   vertices.push(Math.random() * 2 - 1)
    // }

    // const buffer = wgl.createArrayBuffer()
    // buffer.update(vertices, cx.DYNAMIC_DRAW)
    // // cx.bindBuffer(cx.ARRAY_BUFFER, buffer)
    // // cx.bufferData(cx.ARRAY_BUFFER, new Float32Array(vertices), cx.DYNAMIC_DRAW)

    // const pg = programs.copy

    // const pos2d = pg.getAttribLocation('pos2d')
    // cx.vertexAttribPointer(pos2d, 2, cx.FLOAT, false, 0, 0)
    // cx.enableVertexAttribArray(pos2d)

    // const size = pg.getAttribLocation('size')
    // cx.vertexAttrib1f(size, 2)

    // cx.uniform4f(pg.getUniformLocation('color'), 1, 0.5, 0, 1)

    this.play()
  },
  watch: {
    x (val: number): void {
      // wgl.context.vertexAttrib1f(gl.getAttribLocation('size'), val)
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
      // const cx = wgl.context
      // wgl.defaultFramebuffer.bind()
      // textures.front.bind()
      // cx.viewport(0, 0, this.w, this.h)
      // programs.copy.use().attrib('quad', buffers.quad, 2)
      // for (let i = 0; i < vertexCount * 2; i += 2) {
      //   vertices[i] += Math.random() * 0.01 - 0.005
      //   vertices[i + 1] += Math.random() * 0.01 - 0.005
      // }
      // const cx = wgl.context
      // cx.bufferSubData(cx.ARRAY_BUFFER, 0, new Float32Array(vertices))
      // cx.clear(cx.COLOR_BUFFER_BIT)
      // cx.drawArrays(cx.POINTS, 0, vertexCount)
    }
  },
  filters: {
    playbutton (isPlaying: boolean) {
      return isPlaying ? '■ stop' : '▶ play'
    }
  }
})
