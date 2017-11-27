<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="1000"
    :height="500"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  >
    <g
      v-for="(cell, i) in cells"
      :key="i"
      :transform="`translate(${(i % padCols) * size} ${Math.floor(i / padCols) * size})`"
    >
      <gol-cell
        :i="i"
        :size="size"
        :state="cell.state"
        @mousedown="checkCell"
        @mouseover="onCellOver"
        ref="gol"
      ></gol-cell>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'
import GolCell from './GolCell.vue'

const padding: number = 1
let timerID: number

const neighbors = (cols: number, rows: number): Array<number> => {
  const n = -cols
  const e = 1
  const s = cols
  const w = -1

  const nw = n - 1
  const ne = n + 1
  const sw = s - 1
  const se = s + 1
  return [
    n, e, s, w, nw, ne, sw, se
  ]
}

const initBoard = (rows: number, cols: number, cb: Function) => {
  const yMax = cols - 1
  const xMax = rows - 1
  return [].concat.apply(
    [],
    [...Array(rows).keys()].map(y => {
      return [...Array(cols).keys()].map(x => ({
        state: (y === 0 || y === yMax || x === 0 || x === xMax) ? 0 : cb(x, y)
      }))
    })
  )
}

export default Vue.extend({
  name: 'GolBoard',
  components: {
    GolCell
  },
  created: function () {
    this.random()
    this.neighbors = neighbors(this.padCols, this.padRows)
  },
  data: function () {
    return {
      isMouseDown: false,
      gen: 0,
      cells: [{
        state: 0
      }],
      neighbors: [0]
    }
  },
  props: {
    cols: { type: Number, required: false, default: 100 },
    rows: { type: Number, required: false, default: 100 },
    size: { type: Number, required: false, default: 10 },
    play: { type: Boolean, required: false, default: false },
    interval: { type: Number }
  },
  watch: {
    play: function (val) {
      val ? this.start() : this.stop()
    }
  },
  computed: {
    padCols (): number {
      return this.cols + padding * 2
    },
    padRows (): number {
      return this.rows + padding * 2
    }
  },
  methods: {
    onMouseDown () {
      this.isMouseDown = true
    },
    onMouseUp () {
      this.isMouseDown = false
    },
    checkCell (i: number) {
      this.cells[i].state = this.cells[i].state === 0 ? 1 : 0
    },
    onCellOver (i: number) {
      if (!this.isMouseDown) return
      this.checkCell(i)
    },
    start (): void {
      console.log('start')
      timerID = setInterval(this.nextGen, this.interval)
    },
    stop (): void {
      console.log('stop')
      clearInterval(timerID)
    },
    step (): void {
      console.log('step')
      this.nextGen()
    },
    clear (): void {
      this.gen = 0
      this.cells = initBoard(this.padRows, this.padCols, () => 0)
    },
    random (): void {
      this.gen = 0
      this.cells = initBoard(this.padRows, this.padCols, () => Math.random() > 0.8 ? 1 : 0)
    },
    nextGen (): void {
      this.gen++

      const nCounts = this.cells
      .map((c: any, i: number, ary: Array<any>) => {
        let sum: number = 0
        this.neighbors.forEach((n: number) => {
          const nCell: any = ary[i + n]
          if (nCell === undefined || nCell.state === 0) return
          sum += 1
        })
        return sum
      })

      this.cells
      .forEach((c: any, i: number) => {
        const n: number = nCounts[i]
        c.state = (n === 3 || n === 2 && c.state) ? 1 : 0
      })

    }
  }
})

</script>

<style scoped>
</style>
