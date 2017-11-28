<template>
  <div>
    <textarea
      v-model="rawdata"
    />
    <input type="number" v-model.number="w" min="1">
    <input type="number" v-model.number="h" min="1">
    <input type="number" v-model.number="fragmentDigits">
    <hr>

    <h3>raw</h3>
    <gol-preview-table
      :data="data"
      :w="w"
      :h="h"
    />

    <h3>sum</h3>
    <gol-preview-table
      :wrapped="true"
      :data="sum"
      :w="paddedW"
      :h="paddedH"
    />

    <h3>offsets</h3>

    <div class="neighbor">
      <gol-preview-table
        :wrapped="true"
        :data="shiftedBoardList[0]"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :wrapped="true"
        :data="shiftedBoardList[1]"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :wrapped="true"
        :data="shiftedBoardList[2]"
        :w="paddedW"
        :h="paddedH"
      />
    </div>
    <div class="neighbor">
      <gol-preview-table
        :wrapped="true"
        :data="shiftedBoardList[3]"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :wrapped="true"
        :data="wrappedData"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :wrapped="true"
        :data="shiftedBoardList[4]"
        :w="paddedW"
        :h="paddedH"
      />
    </div>
    <div class="neighbor">
      <gol-preview-table
        :wrapped="true"
        :data="shiftedBoardList[5]"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :wrapped="true"
        :data="shiftedBoardList[6]"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :wrapped="true"
        :data="shiftedBoardList[7]"
        :w="paddedW"
        :h="paddedH"
      />
    </div>

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
  data: function () {
    return {
      rawdata: '1001111000001010100001011010',
      w: 6,
      h: 6,
      shiftedBoardList: Array(8).fill(''),
      fragmentDigits: 15 // log2(10^15) => 50bit < 53bit
    }
  },
  props: {
  },
  watch: {
    wrappedData () {
      this.calcShiftedBoardList()
    }
  },
  mounted () {
    this.calcShiftedBoardList()
  },
  computed: {
    paddedW (): number {
//      this.calcShiftedBoardList()
      return this.w + 2
    },
    paddedH (): number { return this.h + 2 },
    wrappedData (): string {
      const wrapped = [
        '0'.repeat(this.paddedW + 1),
        splitByLength(this.rawdata, this.paddedW)
        .map(s => s + '00')
        .join(''),
        '0'.repeat(this.paddedW - 1)
      ].join('')

      return wrapped.padEnd(Math.ceil(wrapped.length / this.paddedW) * this.paddedW, '0')
    },
    data (): string {
      return this.rawdata.padEnd(Math.ceil(this.rawdata.length / this.w) * this.w, '0')
    },
    sum (): string {
      const boardSumFragments = this.shiftedBoardList
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
        lastFragment.toString().padStart(this.wrappedData.length % this.fragmentDigits, '0')
      ].join('')
    }
  },
  methods: {
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
      const len = this.wrappedData.length
      return offset < 0
      ? this.wrappedData.slice(0, offset).padStart(len, '0')
      : this.wrappedData.slice(offset).padEnd(len, '0')
    }
  }
})

</script>

<style scoped>
</style>
