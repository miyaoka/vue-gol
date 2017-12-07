import Program from './Program'
import Buffer from './Buffer'
import Texture from './Texture'
import Framebuffer from './Framebuffer'

class Wgl {
  public static QUAD2 = new Float32Array([ -1, -1, 1, -1, -1, 1, 1, 1 ])
  public gl: WebGLRenderingContext
  public defaultFramebuffer: Framebuffer

  constructor (gl: WebGLRenderingContext) {
    this.gl = gl
    this.defaultFramebuffer = new Framebuffer(gl, null)
  }
  static isArray (object: any): boolean {
    const name = Object.prototype.toString.apply(object, [])
    const re = / (Float(32|64)|Int(16|32|8)|Uint(16|32|8(Clamped)?))?Array]$/

    return re.exec(name) !== null
  }
  static initFromCanvas (canvas: HTMLCanvasElement): Wgl {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if (!gl) throw new Error('This browser does not support WebGL')
    gl.viewport(0, 0, canvas.width, canvas.height)

    return new Wgl(gl)
  }
  public createProgram (vert: string, frag: string): Program {
    return new Program(this.gl, vert, frag)
  }
  public createArrayBuffer (): Buffer {
    return new Buffer(this.gl, this.gl.ARRAY_BUFFER)
  }
  public createTexture (
    format: number = this.gl.RGBA,
    wrap: number = this.gl.CLAMP_TO_EDGE,
    filter: number = this.gl.LINEAR,
    type: number = this.gl.UNSIGNED_BYTE
  ): Texture {
    return new Texture(this.gl, format, wrap, filter, type)
  }
  public createFramebuffer (): Framebuffer {
    return new Framebuffer(this.gl)
  }
}

export default Wgl
export { Program, Buffer, Texture, Framebuffer }
