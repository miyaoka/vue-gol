import Wgl, { Buffer } from './'

interface IArray {
  length: number
}

class Program {
  public context: WebGLRenderingContext
  public program: WebGLProgram | null
  public locations: { [key: string]: WebGLUniformLocation | null }

  constructor (context: WebGLRenderingContext, vert: string, frag: string) {
    this.context = context
    const cx = this.context
    const pg = (this.program = cx.createProgram())
    cx.attachShader(pg, this.makeShader(cx.VERTEX_SHADER, vert))
    cx.attachShader(pg, this.makeShader(cx.FRAGMENT_SHADER, frag))
    cx.linkProgram(pg)
    if (!cx.getProgramParameter(pg, cx.LINK_STATUS)) {
      throw new Error(cx.getProgramInfoLog(pg) || '')
    }
    this.locations = {}
  }
  makeShader (type: number, source: string): WebGLShader | null {
    const cx = this.context
    const sd = cx.createShader(type)
    cx.shaderSource(sd, source)
    cx.compileShader(sd)
    if (!cx.getShaderParameter(sd, cx.COMPILE_STATUS)) {
      throw new Error(cx.getShaderInfoLog(sd) || '')
    }
    return sd
  }
  public getAttribLocation (name: string): number {
    return this.context.getAttribLocation(this.program, name)
  }
  public getUniformLocation (name: string): WebGLUniformLocation | null {
    return this.context.getUniformLocation(this.program, name)
  }
  public use (): Program {
    this.context.useProgram(this.program)
    return this
  }
  public attrib (name: string, buffer: Buffer, size: number, stride: number = 0): Program {
    const cx = this.context
    cx.getAttribLocation(this.program, name)
    buffer.bind()
    const index = 0
    cx.enableVertexAttribArray(index)
    cx.vertexAttribPointer(index, size, cx.FLOAT, false, stride, 0)
    return this
  }
  public uniform (name: string, value?: number | number[] | Int32Array | Float32Array, isInt?: boolean): Program {
    const cx = this.context
    if (value === undefined) {
      this.locations[name] = cx.getUniformLocation(this.program, name)
      return this
    }

    const numType = isInt ? 'i' : 'f'

    let method
    if (Wgl.isArray(value)) {
      method = `uniform${(value as IArray).length}${numType}v`
    } else {
      const tov = typeof value
      if (tov === 'number' || tov === 'boolean') {
        method = `uniform1${numType}`
      } else {
        throw new Error('Invalid uniform value: ' + value)
      }
    }

    if (this.locations[name] === null) this.uniform(name)
    const location = this.locations[name] as WebGLUniformLocation

    const cxa = cx as any
    cxa[method](location, value)
    return this
  }
  public uniformi (name: string, value?: number | number[] | Int32Array | Float32Array): Program {
    return this.uniform(name, value, true)
  }
  public draw (mode: number, count: number, type?: number): Program {
    const cx = this.context
    if (type === undefined) {
      cx.drawArrays(mode, 0, count)
    } else {
      cx.drawElements(mode, count, type, 0)
    }
    if (cx.getError() !== cx.NO_ERROR) throw new Error('Render error')

    return this
  }
}

export default Program
