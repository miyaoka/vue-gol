import Vue from 'vue'
import Wgl, { Program, Buffer, Texture, Framebuffer } from '../lib/Wgl'

import fgColor from '@/shaders/color.frag'
import fgRandom from '@/shaders/golRandom.frag'
import fgCopy from '@/shaders/golCopy.frag'
import fgProcess from '@/shaders/golProcess.frag'
import vert from '@/shaders/gol.vert'

let wgl: Wgl
let programs: { [key: string]: Program }
let buffers: { [key: string]: Buffer }
let textures: { [key: string]: Texture }
let framebuffers: { [key: string]: Framebuffer }
let fpsList: number[] = []
const fpsSampleCount = 30

interface IArray {
  length: number
}

export default Vue.extend({
  components: {},
  mounted () {
    this.initGL()
  },
  data () {
    return {
      animationId: 0
    }
  },
  props: {
    w: { type: Number, default: 128 },
    h: { type: Number, default: 128 },
    scale: { type: Number, default: 1 },
    isPlaying: { type: Boolean, default: false },
    noise: { type: Boolean, default: false },
    randomSeed: { type: Number, default: 10 },
    fps: { type: Number, default: 0 },
    stepCount: { type: Number, default: 0 }
  },
  watch: {
    noise () {
      this.initRandom(this.randomSeed)
    },
    randomSeed (val) {
      this.initRandom(val)
    },
    w (val) {
      this.initGL()
    },
    h (val) {
      this.initGL()
    },
    isPlaying (val) {
      val ? this.play() : this.stop()
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
    viewSize (): Float32Array {
      return new Float32Array([ this.w, this.h ])
    },
    viewSquare (): number {
      return this.viewSize[0] * this.viewSize[1]
    }
  },
  methods: {
    initGL () {
      try {
        wgl = Wgl.initFromCanvas(this.$refs.canvas as HTMLCanvasElement)
      } catch (err) {
        console.error(err)
        return
      }
      const gl = wgl.gl
      // gl.clearColor(1, 1, 0.9, 1)
      gl.disable(gl.DEPTH_TEST)

      // shaders
      programs = {
        copy: wgl.createProgram(vert, fgCopy),
        gol: wgl.createProgram(vert, fgProcess)
      }
      buffers = {
        quad: wgl.createArrayBuffer().update(Wgl.QUAD2, gl.STATIC_DRAW)
      }
      textures = {
        front: wgl.createTexture(gl.RGBA, gl.REPEAT, gl.NEAREST).blank(this.viewSize[0], this.viewSize[1]),
        back: wgl.createTexture(gl.RGBA, gl.REPEAT, gl.NEAREST).blank(this.viewSize[0], this.viewSize[1])
      }
      framebuffers = {
        step: wgl.createFramebuffer()
      }
      cancelAnimationFrame(this.animationId)
      this.initRandom(this.randomSeed)

      if (this.isPlaying) this.play()
    },
    initRandom (span: number = Math.ceil(Math.random() * 50 + 2)): void {
      this.$emit('update:stepCount', 0)
      // this.stop()
      const noiseRate = this.noise ? 1 / this.viewSquare * 50 : 0

      this.setTexture(
        new Uint8Array(this.viewSquare).map((v, i) => {
          const num = Math.floor(i / this.w) % span
          // if (num === 0) console.log(i, num)
          return num === 0 && i % this.w > 0 && Math.random() > noiseRate ? 1 : 0
          // return Math.random() > 0.3 ? 1 : 0
        }),
        0x42b983
      )
      // let count = Math.random() * 100 + 10
      // while (count-- > 0) {
      //   this.stepNext()
      // }
      this.render()
      // this.play()
    },
    /**
     *
     * @param state
     * @param color hex
     */
    setTexture (state: Uint8Array, color: number): void {
      const gl = wgl.gl
      const r = (color & 0xff0000) >> 16
      const g = (color & 0xff00) >> 8
      const b = color & 0xff
      const rgba = new Uint8Array(this.viewSquare * 4)
      state.forEach((val, i) => {
        const ii = i * 4
        rgba[ii + 0] = r
        rgba[ii + 1] = g
        rgba[ii + 2] = b
        rgba[ii + 3] = state[i] ? 255 : 0
      })
      textures.front.subset(0, 0, this.viewSize[0], this.viewSize[1], rgba)
    },
    play (): void {
      fpsList = [ performance.now() ]
      this.loop()
      this.$emit('update:isPlaying', true)
    },
    loop (): void {
      fpsList = [ ...fpsList, performance.now() ].slice(-fpsSampleCount)

      const diffSum = fpsList
        .slice(1)
        .map((val: number, i: number, ary: number[]) => val - fpsList[i])
        .reduce((prev: number, curr: number) => prev + curr)

      this.$emit('update:fps', 1000 / (diffSum / (fpsList.length - 1)))

      this.animationId = requestAnimationFrame(this.loop)
      this.stepNext()
    },
    stop (): void {
      cancelAnimationFrame(this.animationId)
      this.animationId = -1
      this.$emit('update:isPlaying', false)
    },
    stepNext (): void {
      this.calc()
      this.render()
    },
    calc (): void {
      this.$emit('update:stepCount', this.stepCount + 1)

      const gl = wgl.gl

      framebuffers.step.attach(textures.back.texture)
      textures.front.bind(0)
      gl.viewport(0, 0, this.viewSize[0], this.viewSize[1])

      programs.gol
        .use()
        .attrib('quad', buffers.quad, 2)
        .uniformi('state', 0)
        .uniform('scale', this.viewSize)
        .draw(gl.TRIANGLE_STRIP, 4)

      // swap
      const tmp = textures.front
      textures.front = textures.back
      textures.back = tmp
    },
    render (): void {
      const gl = wgl.gl

      wgl.defaultFramebuffer.bind()
      textures.front.bind(0)
      gl.viewport(0, 0, this.viewSize[0], this.viewSize[1])

      programs.copy
        .use()
        .attrib('quad', buffers.quad, 2)
        .uniformi('state', 0)
        .uniform('scale', this.viewSize)
        .draw(gl.TRIANGLE_STRIP, 4)
    }
  }
})
