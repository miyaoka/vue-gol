class GlUtil {
  public context: WebGLRenderingContext
  public program: WebGLProgram | null

  constructor (context: WebGLRenderingContext) {
    this.context = context
    this.program = context.createProgram()
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
  public linkProgram (vert: string, frag: string): GlUtil {
    const pr = this.program
    const co = this.context
    co.attachShader(pr, GlUtil.makeShader(co, co.VERTEX_SHADER, vert))
    co.attachShader(pr, GlUtil.makeShader(co, co.FRAGMENT_SHADER, frag))
    co.linkProgram(pr)
    if (!co.getProgramParameter(pr, co.LINK_STATUS)) {
      throw new Error(co.getProgramInfoLog(pr) || '')
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
  public clone (): GlUtil {
    return new GlUtil(this.context)
  }
}

export default GlUtil
