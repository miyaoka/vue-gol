<template>
  <div>
    <section>
      <textarea
        v-model="rawdata"
        v-if="false"
      />
      count:<input type="number" v-model.number="count" min="1">
      w:<input type="number" v-model.number="w" min="1">
      digits:<input type="number" v-model.number="fragmentDigits">
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

    <section v-if="display">
      <h3>current</h3>
      <gol-preview-table
        :data="board"
        :w="w"
      />
      <gol-preview-table
        v-if="false"
        :data="nextBoard"
        :w="w"
      />
    </section>

    <section v-if="false">
      <h3>sum</h3>
      <gol-preview-table
        :wrapped="true"
        :data="neighborBoard"
        :w="paddedW"
      />
      <gol-preview-table
        :wrapped="true"
        :data="currentAndNeighborBoard"
        :w="paddedW"
      />
    </section>

    <section v-if="false">
      <h3>offsets</h3>

      <div>
        <gol-preview-table
          :wrapped="true"
          :data="shiftedBoardList[0]"
          :w="paddedW"
        />
        <gol-preview-table
          :wrapped="true"
          :data="shiftedBoardList[1]"
          :w="paddedW"
        />
        <gol-preview-table
          :wrapped="true"
          :data="shiftedBoardList[2]"
          :w="paddedW"
        />
      </div>
      <div>
        <gol-preview-table
          :wrapped="true"
          :data="shiftedBoardList[3]"
          :w="paddedW"
        />
        <gol-preview-table
          :wrapped="true"
          :data="wrappedBoard"
          :w="paddedW"
        />
        <gol-preview-table
          :wrapped="true"
          :data="shiftedBoardList[4]"
          :w="paddedW"
        />
      </div>
      <div>
        <gol-preview-table
          :wrapped="true"
          :data="shiftedBoardList[5]"
          :w="paddedW"
        />
        <gol-preview-table
          :wrapped="true"
          :data="shiftedBoardList[6]"
          :w="paddedW"
        />
        <gol-preview-table
          :wrapped="true"
          :data="shiftedBoardList[7]"
          :w="paddedW"
        />
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GolPreviewTable from './GolPreviewTable.vue'

const splitByLength = (str: string, len: number): Array<string> => {
  return str.split(new RegExp('(.{' + len + '})')).filter(x => x)
}

export default Vue.extend({
  name: 'GolPreview',
  components: {
    GolPreviewTable
  },
  data () {
    return {
      rawdata: '',
      display: true,
      playingId: 0,
      playInterval: 100,
      w: 80,
      count: 3000,
      perfCount: 50,
      shiftedBoardList: Array(8).fill(''),
      fragmentDigits: 15 // log2(10^15) => 50bit < 53bit (JS Number limitation)
    }
  },
  props: {
  },
  watch: {
    count () {
      this.initBoard()
    },
    wrappedBoard () {
      this.calcShiftedBoardList()
    }
  },
  mounted () {
    this.initBoard()
    this.calcShiftedBoardList()
  },
  computed: {
    isPlaying (): boolean { return this.playingId !== 0 },
    paddedW (): number { return this.w + 2 },
    board (): string {
      return this.rawdata.padEnd(Math.ceil(this.rawdata.length / this.w) * this.w, '0')
    },
    wrappedBoard (): string {
      return this.wrapBoard(this.rawdata)
    },
    neighborBoard (): string {
      return this.sumBoard(this.shiftedBoardList)
    },
    currentAndNeighborBoard (): string {
      const b1and2 = this.sumBoard([
        this.neighborBoard.replace(/[^2]/g, '0'),
        this.wrappedBoard
      ]).replace(/[^3]/g, '0')

      return this.sumBoard([
        b1and2,
        this.neighborBoard.replace(/[^3]/g, '0')
      ]).replace(/[3]/g, '1')
    },
    nextBoard (): string {
      return this.unwrapBoard(this.currentAndNeighborBoard)
    }
  },
  methods: {
    initBoard (): void {
      this.stop()
      this.rawdata = Array(this.count).fill('').map(v => Math.random() > 0.6 ? '1' : '0').join('')
    },
    wrapBoard (board: string): string {
      const wrapped = [
        '0'.repeat(this.paddedW + 1),
        splitByLength(board, this.w)
        .map(s => s + '00')
        .join(''),
        '0'.repeat(this.paddedW - 1)
      ].join('')

      return wrapped.padEnd(Math.ceil(wrapped.length / this.paddedW) * this.paddedW, '0')
    },
    unwrapBoard (board: string): string {
      let ary = splitByLength(board, this.paddedW)
      ary = ary.slice(1, -1)
      return ary.map(line => line.slice(1, -1)).join('')
    },
    stepNext (): void {
      this.rawdata = this.nextBoard
    },
    play (): void {
      this.playingId = setInterval(this.stepNext, this.playInterval)
    },
    stop (): void {
      clearInterval(this.playingId)
      this.playingId = 0
    },
    perf (): void {
      console.log('start', `${this.count} dot x ${this.perfCount} step`)
      const start = window.performance.now()
      let c = this.perfCount
      // console.time('perf')
      while (c-- > 0) {
        this.calcShiftedBoardList()
        this.stepNext()
      }
      // console.timeEnd('perf')
      const time = window.performance.now() - start
      console.log('end', time, time / this.perfCount)
    },
    sumBoard (boardList: Array<string>): string {
      const boardSumFragments = boardList
      .map(boardData => {
        return splitByLength(boardData, this.fragmentDigits)
        .map(fragment => Number(fragment))
      })
      .reduce((prev: number[], curr: number[]) => {
        return prev.map((fragment, i) => fragment + curr[i])
      })
      const lastFragment = boardSumFragments.pop() || ''
      return [
        ...boardSumFragments.map(s => s.toString().padStart(this.fragmentDigits, '0')),
        lastFragment.toString().padStart(this.wrappedBoard.length % this.fragmentDigits, '0')
      ].join('')
    },
    calcShiftedBoardList (): void {
      this.shiftedBoardList =
      [
        -this.paddedW - 1, -this.paddedW, -this.paddedW + 1,
        -1, 1,
        this.paddedW - 1, this.paddedW, this.paddedW + 1
      ].map(offset => this.shiftBoardData(offset))
    },
    shiftBoardData (offset: number): string {
      offset *= -1
      const len = this.wrappedBoard.length
      return offset < 0
      ? this.wrappedBoard.slice(0, offset).padStart(len, '0')
      : this.wrappedBoard.slice(offset).padEnd(len, '0')
    }
  }
})

</script>

<style scoped>
</style>
