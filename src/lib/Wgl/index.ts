import Program from './Program'
import Buffer from './Buffer'
import Texture from './Texture'
import Framebuffer from './Framebuffer'

class Wgl {
  public static QUAD2 = new Float32Array([ -1, -1, 1, -1, -1, 1, 1, 1 ])
  public context: WebGLRenderingContext
  public defaultFramebuffer: Framebuffer

  constructor (context: WebGLRenderingContext) {
    this.context = context
    this.defaultFramebuffer = new Framebuffer(this.context)
  }
  static isArray (object: any) {
    const name = Object.prototype.toString.apply(object, [])
    const re = / (Float(32|64)|Int(16|32|8)|Uint(16|32|8(Clamped)?))?Array]$/
    return re.exec(name) !== null
  }
  static initFromCanvas (canvas: HTMLCanvasElement): Wgl {
    const cx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!cx) {
      throw new Error('This browser does not support WebGL')
    }
    cx.viewport(0, 0, canvas.width, canvas.height)
    return new Wgl(cx)
  }
  public createProgram (vert: string, frag: string): Program {
    return new Program(this.context, vert, frag)
  }
  public createArrayBuffer (): Buffer {
    return new Buffer(this.context, this.context.ARRAY_BUFFER)
  }
  public createElementArrayBuffer (): Buffer {
    return new Buffer(this.context, this.context.ELEMENT_ARRAY_BUFFER)
  }
  public createTexture (
    format: number = this.context.RGBA,
    wrap: number = this.context.CLAMP_TO_EDGE,
    filter: number = this.context.LINEAR,
    type: number = this.context.UNSIGNED_BYTE
  ): Texture {
    return new Texture(this.context, format, wrap, filter, type)
  }
  public createFramebuffer (): Framebuffer {
    return new Framebuffer(this.context)
  }
}

export default Wgl
export { Program, Buffer, Texture, Framebuffer }
