import GlUtilProgram from './Program'

class GlUtil {
  public gl: WebGLRenderingContext
  constructor (gl: WebGLRenderingContext) {
    this.gl = gl
  }
  public static makeShader (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const s = gl.createShader(type)
    gl.shaderSource(s, source)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) || '')
    }
    return s
  }
  public makeProgram (vert: string, frag: string): GlUtilProgram {
    return new GlUtilProgram(this.gl, vert, frag)
  }
}

export { GlUtil, GlUtilProgram }
