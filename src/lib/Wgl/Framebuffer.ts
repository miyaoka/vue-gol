class Framebuffer {
  public context: WebGLRenderingContext
  public framebuffer: WebGLFramebuffer | null
  public renderbuffer: WebGLRenderbuffer | null = null

  constructor (context: WebGLRenderingContext, framebuffer = context.createFramebuffer()) {
    this.context = context
    this.framebuffer = framebuffer
  }

  public bind (): Framebuffer {
    this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.framebuffer)
    return this
  }
  public unbind (): Framebuffer {
    this.context.bindFramebuffer(this.context.FRAMEBUFFER, null)
    return this
  }
  public attach (texture: WebGLTexture): Framebuffer {
    const cx = this.context
    this.bind()
    cx.framebufferTexture2D(cx.FRAMEBUFFER, cx.COLOR_ATTACHMENT0, cx.TEXTURE_2D, texture, 0)
    return this
  }
}

export default Framebuffer
