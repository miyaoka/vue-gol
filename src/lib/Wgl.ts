class Wgl {
  public context: WebGLRenderingContext

  constructor (context: WebGLRenderingContext) {
    this.context = context
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
}

class Program extends Wgl {
  public program: WebGLProgram | null

  constructor (context: WebGLRenderingContext, vert: string, frag: string) {
    super(context)
    const cx = this.context
    const pg = (this.program = cx.createProgram())
    cx.attachShader(pg, this.makeShader(cx.VERTEX_SHADER, vert))
    cx.attachShader(pg, this.makeShader(cx.FRAGMENT_SHADER, frag))
    cx.linkProgram(pg)
    if (!cx.getProgramParameter(pg, cx.LINK_STATUS)) {
      throw new Error(cx.getProgramInfoLog(pg) || '')
    }
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
  public attrib (name: string, buffer: Buffer, size: number, stride: number) {
    const cx = this.context
    cx.getAttribLocation(this.program, name)
    buffer.bind()
    const index = 0
    cx.enableVertexAttribArray(index)
    cx.vertexAttribPointer(index, size, cx.FLOAT, false, stride, 0)

    return this
  }
}

class Buffer extends Wgl {
  public buffer: WebGLBuffer | null
  public target: number

  /**
   *
   * @param context
   * @param target ARRAY_BUFFER | ELEMENT_ARRAY_BUFFER
   */
  constructor (context: WebGLRenderingContext, target: number) {
    super(context)
    const cx = this.context
    this.buffer = cx.createBuffer()
    this.target = target
  }

  public bind (): Buffer {
    this.context.bindBuffer(this.target, this.buffer)
    return this
  }

  public update (data: number[], usage: number = this.context.STATIC_DRAW) {
    const cx = this.context
    this.bind()
    cx.bufferData(this.target, new Float32Array(data), usage)
    cx.bindBuffer(this.target, null)
  }
}

export default Wgl
export { Program, Buffer }
