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
      :transform="`translate(${(i % cols) * size} ${Math.floor(i / cols) * size})`"
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

let timerID: number

const getNeighbor = (i: number, cols: number, rows: number): Array<number> => {
  const n: number = -cols
  const e = 1
  const s = cols
  const w = -1

  const nw = n - 1
  const ne = n + 1
  const sw = s - 1
  const se = s + 1

  const x = i % cols
  const y = Math.floor(i / cols)

  const neighbors = []

  const xMax = cols - 1
  const yMax = rows - 1
  const yNeighbors = (T: number, B: number): Array<number> => {
    const ary: Array<number> = []
    if (y > 0) ary.push(T)
    if (y < yMax) ary.push(B)
    return ary
  }

  if (x > 0) {
    neighbors.push(w, ...yNeighbors(nw, sw))
  }
  if (x < xMax) {
    neighbors.push(e, ...yNeighbors(ne, se))
  }
  neighbors.push(...yNeighbors(n, s))
  return neighbors
}

export default Vue.extend({
  name: 'GolBoard',
  components: {
    GolCell
  },
  data: function () {
    return {
      isMouseDown: false,
      gen: 0,
      cells: [].concat.apply(
        [],
        [...Array(this.rows).keys()].map(r => {
          return [...Array(this.cols).keys()].map(c => ({
            state: Math.random() > 0.8 ? 1 : 0,
            neighbors: getNeighbor(r * this.cols + c, this.cols, this.rows)
          }))
        })
      )
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
      console.log('clear')
      this.cells = [].concat.apply(
        [],
        [...Array(this.rows).keys()].map(r => {
          return [...Array(this.cols).keys()].map(c => ({
            state: 0,
            neighbors: getNeighbor(r * this.cols + c, this.cols, this.rows)
          }))
        })
      )
    },
    random (): void {
      console.log('random')
      this.cells = [].concat.apply(
        [],
        [...Array(this.rows).keys()].map(r => {
          return [...Array(this.cols).keys()].map(c => ({
            state: Math.random() > 0.8 ? 1 : 0,
            neighbors: getNeighbor(r * this.cols + c, this.cols, this.rows)
          }))
        })
      )
    },
    nextGen (): void {
      this.gen++

      const nCounts = this.cells
      .map((c: any, i: number, ary: Array<any>) => {
        let sum: number = 0
        c.neighbors.forEach((n: number) => {
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
