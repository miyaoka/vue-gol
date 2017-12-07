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
      w: 256,
      h: 256,
      animationId: 0,
      scale: 4
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
    const gl = wgl.gl
    gl.clearColor(1, 1, 0.9, 1)
    gl.disable(gl.DEPTH_TEST)

    // shaders
    programs = {
      copy: wgl.createProgram(vert, fgCopy),
      gol: wgl.createProgram(vert, fgProcess)
    }
    buffers = {
      quad: wgl.createArrayBuffer().update(Wgl.QUAD2)
    }
    textures = {
      front: wgl.createTexture(gl.RGBA, gl.REPEAT, gl.NEAREST).blank(this.viewSize[0], this.viewSize[1]),
      back: wgl.createTexture(gl.RGBA, gl.REPEAT, gl.NEAREST).blank(this.viewSize[0], this.viewSize[1])
    }
    framebuffers = {
      step: wgl.createFramebuffer()
    }
    console.log(textures.front.texture)

    // random
    this.setTexture(new Uint8Array(this.viewSize[0] * this.viewSize[1]).map((v) => (Math.random() > 0.5 ? 1 : 0)))

    //    this.play()
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
    },
    viewSize (): Float32Array {
      return new Float32Array([ this.w, this.h ])
    },
    viewSquare (): number {
      return this.viewSize[0] * this.viewSize[1]
    }
  },
  methods: {
    setTexture (state: Uint8Array): void {
      const gl = wgl.gl
      const rgba = new Uint8Array(this.viewSquare * 4)
      state.forEach((val, i) => {
        const ii = i * 4
        rgba[ii + 0] = rgba[ii + 1] = rgba[ii + 2] = state[i] ? 255 : 0
        rgba[ii + 3] = 255
      })
      textures.front.subset2(0, 0, this.viewSize[0], this.viewSize[1], rgba)
    },
    play (): void {
      this.update()
    },
    update (): void {
      this.animationId = requestAnimationFrame(this.update)
      this.step()
      this.render()
    },
    stop (): void {
      console.log('stop')
      cancelAnimationFrame(this.animationId)
      this.animationId = 0
    },
    togglePlay (): void {
      this.isPlaying ? this.stop() : this.play()
    },
    step (): void {
      console.log('step')
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
      console.log('render')
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
      // for (let i = 0; i < vertexCount * 2; i += 2) {
      //   vertices[i] += Math.random() * 0.01 - 0.005
      //   vertices[i + 1] += Math.random() * 0.01 - 0.005
      // }
      // const gl = wgl.context
      // gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices))
      // gl.clear(gl.COLOR_BUFFER_BIT)
      // gl.drawArrays(gl.POINTS, 0, vertexCount)
    }
  },
  filters: {
    playbutton (isPlaying: boolean) {
      return isPlaying ? '■ stop' : '▶ play'
    }
  }
})
