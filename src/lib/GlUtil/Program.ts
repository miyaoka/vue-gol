import { GlUtil } from './'

class GlUtilProgram {
  public gl: WebGLRenderingContext
  public program: WebGLProgram | null
  constructor (gl: WebGLRenderingContext, vert: string, frag: string) {
    this.gl = gl
    const p = this.program = gl.createProgram()
    gl.attachShader(p, GlUtil.makeShader(gl, gl.VERTEX_SHADER, vert))
    gl.attachShader(p, GlUtil.makeShader(gl, gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(p)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(p) || '')
    }
  }
  public getAttribLocation (name: string): number {
    return this.gl.getAttribLocation(this.program, name)
  }
  public use (): void {
    this.gl.useProgram(this.program)
  }
}
export default GlUtilProgram
