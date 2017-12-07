class Framebuffer {
  public gl: WebGLRenderingContext
  public framebuffer: WebGLFramebuffer | null
  public renderbuffer: WebGLRenderbuffer | null = null

  constructor (gl: WebGLRenderingContext, framebuffer = gl.createFramebuffer()) {
    this.gl = gl
    this.framebuffer = framebuffer
  }

  public bind (): Framebuffer {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)

    return this
  }
  public unbind (): Framebuffer {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    return this
  }
  public attach (texture: WebGLTexture | null): Framebuffer {
    const gl = this.gl

    this.bind()
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

    return this
  }
}

export default Framebuffer
