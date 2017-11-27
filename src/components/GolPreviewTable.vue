<template>
  <div>
    <table>
      <tr
        v-for="(row, ri) in dataArray"
        :key="ri"
      >
        <td
          v-for="(col, ci) in row"
          :key="ci"
          :class="{live: col > 0}"
        >
          {{col}}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'GolPreviewTable',
  components: {
  },
  data: function () {
    return {
    }
  },
  props: {
    data: {
      type: String
    },
    w: { type: Number },
    h: { type: Number }
  },
  watch: {
  },
  computed: {
    dataArray (): any {
      return this.data.slice(0, this.w * this.h).split(new RegExp('(.{' + this.w + '})')).filter(x => x)
    }
  },
  methods: {
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

</style>
