<template>
  <div>
    <textarea
      v-model="rawdata"
    />
    <input type="number" v-model.number="w">
    <input type="number" v-model.number="h">
    <input type="number" v-model.number="s">
    <input type="number" v-model.number="digits">
    <hr>

    <gol-preview-table
      :data="data"
      :w="w"
      :h="h"
    />
    <hr>
    sum

      <gol-preview-table
        :data="sum"
        :w="w"
        :h="h"
      />
      <gol-preview-table
        :data="wrappedData"
        :w="w + 2"
        :h="h + 2"
      />

    <hr>
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


    <hr>

    <div class="neighbor">
      <gol-preview-table
        :data="shiftData0(-w-1)"
        :w="w"
        :h="h"
      />
      <gol-preview-table
        :data="shiftData0(-w)"
        :w="w"
        :h="h"
      />
      <gol-preview-table
        :data="shiftData0(-w+1)"
        :w="w"
        :h="h"
      />
    </div>
    <div class="neighbor">
      <gol-preview-table
        :data="shiftData0(-1)"
        :w="w"
        :h="h"
      />
      <gol-preview-table
        :data="shiftData0(1)"
        :w="w"
        :h="h"
      />
    </div>
    <div class="neighbor">
      <gol-preview-table
        :data="shiftData0(w-1)"
        :w="w"
        :h="h"
      />
      <gol-preview-table
        :data="shiftData0(w)"
        :w="w"
        :h="h"
      />
      <gol-preview-table
        :data="shiftData0(w+1)"
        :w="w"
        :h="h"
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
      digits: 15
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
        '0'.repeat(w - 1)
      ].join('')

      return wrapped.padEnd(Math.ceil(wrapped.length / w) * w, '0')
    },
    data (): string {
      return this.rawdata.padEnd(Math.ceil(this.rawdata.length / this.w) * this.w, '0')
    },
    sum (): string {
      const offsets =
      [
        -this.w - 1, -this.w, -this.w + 1,
        -1, 1,
        this.w - 1, this.w, this.w + 1
      ].map(offset => splitByLength(this.shiftData(offset), this.digits).map(split => Number(split)))

      const n = offsets
      .reduce((prev: number[], curr: number[], j, ary) => {
        return prev.map((fragment, i) => {
          return fragment + curr[i]
        })
      })
      .map(sum => sum.toString().padStart(this.w, '0'))

      // console.log(offsets, n, this.w)

      return n.join('')
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
