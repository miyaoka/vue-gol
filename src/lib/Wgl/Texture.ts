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

  public set (source: ArrayBufferView | null, width: number, height: number): Texture
  public set (source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap | ImageData): Texture
  public set (source: any, width?: number, height?: number): Texture {
    const gl = this.gl

    this.bind()
    if (width !== undefined && height !== undefined) {
      gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, this.castSource(source))
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, source)
    }

    return this
  }

  public subset (xoff: number, yoff: number, source: ArrayBufferView | null, width: number, height: number): Texture
  public subset (
    xoff: number,
    yoff: number,
    source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap | ImageData
  ): Texture
  public subset (xoff: number, yoff: number, source: any, width?: number, height?: number): Texture {
    const gl = this.gl

    this.bind()
    if (width !== undefined && height !== undefined) {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, xoff, yoff, width, height, this.format, this.type, this.castSource(source))
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, xoff, yoff, this.format, this.type, source)
    }

    return this
  }

  public blank (width: number, height: number): Texture {
    return this.set(null, width, height)
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
