class Buffer {
  public gl: WebGLRenderingContext
  public buffer: WebGLBuffer | null
  public target: number
  public size: number

  /**
   *
   * @param gl
   * @param target ARRAY_BUFFER | ELEMENT_ARRAY_BUFFER
   */
  constructor (gl: WebGLRenderingContext, target: number) {
    this.gl = gl
    this.buffer = gl.createBuffer()
    this.target = target
    this.size = -1
  }

  public bind (): Buffer {
    this.gl.bindBuffer(this.target, this.buffer)
    return this
  }

  public update (data: Float32Array | number[], usage: number = this.gl.DYNAMIC_DRAW): Buffer {
    const gl = this.gl
    const f32data = data instanceof Array ? new Float32Array(data) : data
    const byteLength = f32data.byteLength

    this.bind()
    if (this.size !== byteLength) {
      gl.bufferData(this.target, f32data, usage)
      this.size = byteLength
    } else {
      gl.bufferSubData(this.target, 0, f32data)
    }

    return this
  }
}

export default Buffer
