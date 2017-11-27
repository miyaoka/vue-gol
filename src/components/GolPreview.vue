<template>
  <div>
    <textarea
      v-model="rawdata"
    />
    <input type="number" v-model.number="w">
    <input type="number" v-model.number="h">
    <input type="number" v-model.number="s">
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
      :data="sum"
      :w="paddedW"
      :h="paddedH"
    />

    <h3>offsets</h3>

    <div class="neighbor">
      <gol-preview-table
        :data="shiftData(-paddedW-1)"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :data="shiftData(-paddedW)"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :data="shiftData(-paddedW+1)"
        :w="paddedW"
        :h="paddedH"
      />
    </div>
    <div class="neighbor">
      <gol-preview-table
        :data="shiftData(-1)"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :data="shiftData(0)"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :data="shiftData(1)"
        :w="paddedW"
        :h="paddedH"
      />
    </div>
    <div class="neighbor">
      <gol-preview-table
        :data="shiftData(paddedW-1)"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :data="shiftData(paddedW)"
        :w="paddedW"
        :h="paddedH"
      />
      <gol-preview-table
        :data="shiftData(paddedW+1)"
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
      s: 1,
      fragmentDigits: 15 // 10^15 => 50bit < 53bit
    }
  },
  props: {
  },
  watch: {
  },
  computed: {
    paddedW (): number { return this.w + 2 },
    paddedH (): number { return this.h + 2 },
    wrappedData (): string {
      const w = this.w + 2
      const wrapped = [
        '0'.repeat(w + 1),
        splitByLength(this.rawdata, this.w)
        .map(s => s + '00')
        .join(''),
        '0'.repeat(w * 5 - 1)
      ].join('')

      return wrapped.padEnd(Math.ceil(wrapped.length / w) * w, '0')
    },
    data (): string {
      return this.rawdata.padEnd(Math.ceil(this.rawdata.length / this.w) * this.w, '0')
    },
    sum (): string {
      const boardSumFragments =
      [
        -this.paddedW - 1, -this.paddedW, -this.paddedW + 1,
        -1, 1,
        this.paddedW - 1, this.paddedW, this.paddedW + 1
      ].map(offset => {
        return splitByLength(this.shiftData(offset), this.fragmentDigits)
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
    shiftData (offset: number): string {
      offset *= -1
      const len = this.wrappedData.length
      return offset < 0
      ? this.wrappedData.slice(0, offset).padStart(len, '0')
      : this.wrappedData.slice(offset).padEnd(len, '0')
    },
    shiftData0 (sft: number): string {
      const d = parseInt(this.data, 2)
      return ((sft < 0 ? d >> -sft : d << sft) & 0xfffffff).toString(2).padStart(28, '0')
    }
  }
})

</script>

<style scoped>
table {
  border-collapse: collapse;
}
td {
  border: 1px solid;
  padding: 0 6px;
}
td.live {
  background: #fcc
}

.neighbor > div {
  display: inline-block;
}
</style>
