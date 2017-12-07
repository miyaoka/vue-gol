import Wgl, { Buffer } from './'

interface IArray {
  length: number
}

class Program {
  public gl: WebGLRenderingContext
  public program: WebGLProgram | null
  public attribLocations: { [key: string]: number } = {}
  public uniformLocations: { [key: string]: WebGLUniformLocation | null } = {}

  constructor (gl: WebGLRenderingContext, vert: string, frag: string) {
    this.gl = gl
    const pg = (this.program = gl.createProgram())

    gl.attachShader(pg, this.makeShader(gl.VERTEX_SHADER, vert))
    gl.attachShader(pg, this.makeShader(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(pg)
    if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(pg) || '')
    }
  }
  makeShader (type: number, source: string): WebGLShader | null {
    const gl = this.gl
    const sd = gl.createShader(type)

    gl.shaderSource(sd, source)
    gl.compileShader(sd)
    if (!gl.getShaderParameter(sd, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(sd) || '')
    }

    return sd
  }
  public getAttribLocation (name: string): number {
    return this.gl.getAttribLocation(this.program, name)
  }
  public getUniformLocation (name: string): WebGLUniformLocation | null {
    return this.gl.getUniformLocation(this.program, name)
  }
  public use (): Program {
    this.gl.useProgram(this.program)
    return this
  }
  public attrib (name: string, value: Buffer, size: number, stride: number = 0): Program {
    const gl = this.gl
    const location = (this.attribLocations[name] = gl.getAttribLocation(this.program, name))

    value.bind()
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, 0)

    return this
  }
  public uniform (name: string, value: number | number[] | Int32Array | Float32Array, isInt?: boolean): Program {
    const gl = this.gl
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

    const location = (this.uniformLocations[name] = gl.getUniformLocation(this.program, name) as WebGLUniformLocation)
    const gla = gl as any
    gla[method](location, value)

    return this
  }
  public uniformi (name: string, value: number | number[] | Int32Array | Float32Array): Program {
    return this.uniform(name, value, true)
  }
  public draw (mode: number, count: number, type?: number): Program {
    const gl = this.gl

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
