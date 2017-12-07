class Texture {
  public gl: WebGLRenderingContext
  public texture: WebGLTexture | null
  public format: number
  public type: number

  constructor (
    gl: WebGLRenderingContext,
    format: number = gl.RGBA,
    wrap: number = gl.CLAMP_TO_EDGE,
    filter: number = gl.LINEAR,
    type: number = gl.UNSIGNED_BYTE
  ) {
    this.gl = gl
    this.texture = gl.createTexture()
    this.format = format
    this.type = type

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  }
  castSource (source: ArrayBufferView | null): ArrayBufferView | null {
    if (source instanceof Array) {
      source = this.type === this.gl.FLOAT ? new Float32Array(source) : new Uint8Array(source)
    }
    return source
  }
  public set1 (source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap | ImageData): Texture {
    const gl = this.gl

    this.bind()
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, source)

    return this
  }
  public set2 (width: number, height: number, source: ArrayBufferView | null): Texture {
    const gl = this.gl

    this.bind()
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, this.castSource(source))

    return this
  }
  public subset1 (
    source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap | ImageData,
    xoff: number,
    yoff: number
  ): Texture {
    const gl = this.gl

    this.bind()
    gl.texSubImage2D(gl.TEXTURE_2D, 0, xoff, yoff, this.format, this.type, source)

    return this
  }
  public subset2 (xoff: number, yoff: number, width: number, height: number, source: ArrayBufferView | null): Texture {
    const gl = this.gl

    this.bind()
    gl.texSubImage2D(gl.TEXTURE_2D, 0, xoff, yoff, width, height, this.format, this.type, this.castSource(source))

    return this
  }
  public blank (width: number, height: number): Texture {
    return this.set2(width, height, null)
  }
  public bind (unit?: number): Texture {
    const gl = this.gl

    if (unit !== undefined) {
      gl.activeTexture(gl.TEXTURE0 + unit)
    }
    gl.bindTexture(gl.TEXTURE_2D, this.texture)

    return this
  }
}

export default Texture
