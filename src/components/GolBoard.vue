<template>
  <div>
    <section>
      count:{{count}}
      w:<input type="number" v-model.number="cols" min="1">
      h:<input type="number" v-model.number="rows" min="1">
      disp:<input type="checkbox" v-model="display">

      <button
        @click="initBoard"
      >
        💥 Init
      </button>
      <button
        @click="stop();stepNext()"
      >
        → step
      </button>

      <span>
        <button
          v-if="isPlaying"
          @click="stop"
        >
          ■ stop
        </button>
        <span
          v-else
        >
          <button
            @click="play"
          >
            ▶ play
          </button>
          <input type="number" v-model.number="playInterval">ms
        </span>
      </span>


      <button
        @click="perf"
      >
        🔎 perf
      </button>
      perfcount:<input type="number" v-model.number="perfCount" min="1">

    </section>

    <svg
      v-if="display"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :width="cols * size"
      :height="rows * size"
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
  </div>
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
  data () {
    return {
      display: true,
      playingId: 0,
      playInterval: 100,
      w: 80,
      perfCount: 50,
      isMouseDown: false,
      gen: 0,
      cells: [{
        state: 0
      }],
      neighbors: [0],
      cols: 100,
      rows: 30
    }
  },
  props: {
    size: { type: Number, required: false, default: 10 },
    interval: { type: Number }
  },
  computed: {
    isPlaying (): boolean { return this.playingId !== 0 },
    padCols (): number {
      return this.cols + padding * 2
    },
    padRows (): number {
      return this.rows + padding * 2
    },
    count (): number {
      return this.cols * this.rows
    }
  },
  methods: {
    initBoard (): void {
      this.random()
    },
    perf (): void {
      console.log('start', `${this.count} dot x ${this.perfCount} step`)
      const start = window.performance.now()
      let c = this.perfCount
      // console.time('perf')
      while (c-- > 0) {
        this.stepNext()
      }
      // console.timeEnd('perf')
      const time = window.performance.now() - start
      console.log('end', time, time / this.perfCount)
    },
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
    play (): void {
      timerID = setInterval(this.stepNext, this.interval)
    },
    stop (): void {
      clearInterval(timerID)
    },
    step (): void {
      this.stepNext()
    },
    clear (): void {
      this.gen = 0
      this.cells = initBoard(this.padRows, this.padCols, () => 0)
    },
    random (): void {
      this.gen = 0
      this.cells = initBoard(this.padRows, this.padCols, () => Math.random() > 0.8 ? 1 : 0)
    },
    stepNext (): void {
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
