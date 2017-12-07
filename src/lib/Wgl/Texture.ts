class Texture {
  public context: WebGLRenderingContext
  public texture: WebGLTexture | null
  public format: number
  public type: number

  constructor (
    context: WebGLRenderingContext,
    format: number = context.RGBA,
    wrap: number = context.CLAMP_TO_EDGE,
    filter: number = context.LINEAR,
    type: number = context.UNSIGNED_BYTE
  ) {
    const cx = (this.context = this.context)
    this.texture = cx.createTexture()
    cx.bindTexture(cx.TEXTURE_2D, this.texture)
    cx.texParameteri(cx.TEXTURE_2D, cx.TEXTURE_WRAP_S, wrap)
    cx.texParameteri(cx.TEXTURE_2D, cx.TEXTURE_WRAP_T, wrap)
    cx.texParameteri(cx.TEXTURE_2D, cx.TEXTURE_MIN_FILTER, filter)
    cx.texParameteri(cx.TEXTURE_2D, cx.TEXTURE_MAG_FILTER, filter)
    this.format = format
    this.type = type
  }

  public set1 (source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap | ImageData): Texture {
    const cx = this.context
    this.bind()
    cx.texImage2D(cx.TEXTURE_2D, 0, this.format, this.format, this.type, source)
    return this
  }
  public set2 (width: number, height: number, source: ArrayBufferView | null): Texture {
    const cx = this.context
    this.bind()
    if (source instanceof Array) {
      source = this.type === cx.FLOAT ? new Float32Array(source) : new Uint8Array(source)
    }
    cx.texImage2D(cx.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, source)
    return this
  }
  public blank (width: number, height: number): Texture {
    return this.set2(width, height, null)
  }
  public bind (unit?: number): Texture {
    const cx = this.context
    if (unit !== undefined) {
      cx.activeTexture(cx.TEXTURE0 + unit)
    }
    cx.bindTexture(cx.TEXTURE_2D, this.texture)
    return this
  }
}

export default Texture
