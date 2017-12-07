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
    const gl = this.context
    const pg = (this.program = gl.createProgram())
    gl.attachShader(pg, this.makeShader(gl.VERTEX_SHADER, vert))
    gl.attachShader(pg, this.makeShader(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(pg)
    if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(pg) || '')
    }
    this.locations = {}
  }
  makeShader (type: number, source: string): WebGLShader | null {
    const gl = this.context
    const sd = gl.createShader(type)
    gl.shaderSource(sd, source)
    gl.compileShader(sd)
    if (!gl.getShaderParameter(sd, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(sd) || '')
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
    const gl = this.context
    gl.getAttribLocation(this.program, name)
    buffer.bind()
    const index = 0
    gl.enableVertexAttribArray(index)
    gl.vertexAttribPointer(index, size, gl.FLOAT, false, stride, 0)
    return this
  }
  public uniform (name: string, value?: number | number[] | Int32Array | Float32Array, isInt?: boolean): Program {
    const gl = this.context
    if (value === undefined) {
      this.locations[name] = gl.getUniformLocation(this.program, name)
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

    const gla = gl as any
    gla[method](location, value)
    return this
  }
  public uniformi (name: string, value?: number | number[] | Int32Array | Float32Array): Program {
    return this.uniform(name, value, true)
  }
  public draw (mode: number, count: number, type?: number): Program {
    const gl = this.context
    if (type === undefined) {
      gl.drawArrays(mode, 0, count)
    } else {
      gl.drawElements(mode, count, type, 0)
    }
    if (gl.getError() !== gl.NO_ERROR) throw new Error('Render error')

    return this
  }
}

export default Program
