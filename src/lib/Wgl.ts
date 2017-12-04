class Wgl {
  public context: WebGLRenderingContext

  constructor (context: WebGLRenderingContext) {
    this.context = context
  }
  public static makeShader (context: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const s = context.createShader(type)
    context.shaderSource(s, source)
    context.compileShader(s)
    if (!context.getShaderParameter(s, context.COMPILE_STATUS)) {
      throw new Error(context.getShaderInfoLog(s) || '')
    }
    return s
  }
  public createProgram (vert: string, frag: string): Program {
    return new Program(this.context).createProgram(vert, frag)
  }
  public createBuffer (vert: string, frag: string): Buffer {
    return new WglBuffer(this.context).createBuffer(vert, frag)
  }
}

class Program extends Wgl {
  public program: WebGLProgram | null
  public createProgram (vert: string, frag: string): Program {
    const cx = this.context
    const pg = (this.program = cx.createProgram())
    cx.attachShader(pg, Wgl.makeShader(cx, cx.VERTEX_SHADER, vert))
    cx.attachShader(pg, Wgl.makeShader(cx, cx.FRAGMENT_SHADER, frag))
    cx.linkProgram(pg)
    if (!cx.getProgramParameter(pg, cx.LINK_STATUS)) {
      throw new Error(cx.getProgramInfoLog(pr) || '')
    }
    return this
  }
  public getAttribLocation (name: string): number {
    return this.context.getAttribLocation(this.program, name)
  }
  public getUniformLocation (name: string): WebGLUniformLocation | null {
    return this.context.getUniformLocation(this.program, name)
  }
  public use (): void {
    this.context.useProgram(this.program)
  }
}
class Buffer extends Wgl {
  public buffer: WebGLBuffer | null
  public createBuffer (vert: string, frag: string): Buffer {
    const cx = this.context
    return this
  }
}

export default Wgl
export { Program, Buffer }
