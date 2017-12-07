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
    const cx = this.context
    this.buffer = cx.createBuffer()
    this.target = target
    this.size = -1
  }

  public bind (): Buffer {
    this.context.bindBuffer(this.target, this.buffer)
    return this
  }

  public update (data: Float32Array | number[], usage: number = this.context.STATIC_DRAW): Buffer {
    const cx = this.context
    this.bind()
    const f32data = data instanceof Array ? new Float32Array(data) : data
    cx.bufferData(this.target, f32data, usage)
    cx.bindBuffer(this.target, null)

    return this
  }
}

export default Buffer
