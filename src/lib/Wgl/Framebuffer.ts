class Framebuffer {
  public context: WebGLRenderingContext
  public framebuffer: WebGLFramebuffer | null
  public renderbuffer: WebGLRenderbuffer | null

  constructor (context: WebGLRenderingContext, framebuffer = context.createFramebuffer()) {
    this.context = context
    this.framebuffer = framebuffer
    this.renderbuffer = null
  }

  public bind (): Framebuffer {
    this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.framebuffer)
    return this
  }
  public unbind (): Framebuffer {
    this.context.bindFramebuffer(this.context.FRAMEBUFFER, null)
    return this
  }
  public attach (texture: WebGLTexture | null): Framebuffer {
    const gl = this.context
    this.bind()
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    return this
  }
}

export default Framebuffer
