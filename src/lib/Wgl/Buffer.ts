class Buffer {
  public context: WebGLRenderingContext
  public buffer: WebGLBuffer | null
  public target: number
  public size: number

  /**
   *
   * @param context
   * @param target ARRAY_BUFFER | ELEMENT_ARRAY_BUFFER
   */
  constructor (context: WebGLRenderingContext, target: number) {
    this.context = context
    const gl = this.context
    this.buffer = gl.createBuffer()
    this.target = target
    this.size = -1
  }

  public bind (): Buffer {
    this.context.bindBuffer(this.target, this.buffer)
    return this
  }

  public update (data: Float32Array | number[], usage: number = this.context.DYNAMIC_DRAW): Buffer {
    const gl = this.context
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
