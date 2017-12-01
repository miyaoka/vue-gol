<template>
  <div class="preview">
    <table
      :class="{wrapped}"
    >
      <tr
        v-for="(row, ri) in dataArray"
        :key="ri"
      >
        <td
          v-for="(val, ci) in row"
          :key="ci"
          :class="{live: val > 0}"
        >
          {{val}}
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
  data () {
    return {
    }
  },
  props: {
    data: {
      type: String
    },
    w: { type: Number },
    wrapped: { type: Boolean }
  },
  watch: {
  },
  computed: {
    dataArray (): Array<string> {
      return this.data.split(new RegExp('(.{' + this.w + '})')).filter(x => x)
    }
  },
  methods: {
  }
})

</script>

<style scoped>
.preview {
  display: inline-block;
}
table {
  border-collapse: collapse;
  font-size: 9px;
}
td {
  border: 1px solid;
  padding: 0 3px;
}
td.live {
  background: #fcc
}
.wrapped {
  & tr:first-of-type td,
  & tr:last-of-type td,
  & td:first-of-type,
  & td:last-of-type {
    background: #ccc;
  }
}
</style>
