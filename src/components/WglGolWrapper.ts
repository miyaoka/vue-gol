import Vue from 'vue'
import WglGol from '@/components/WglGol.vue'

export default Vue.extend({
  components: {
    WglGol
  },
  data () {
    return {
      wPow: 10,
      hPow: 9,
      scalePow: 0,
      randSpan: 15,
      isPlaying: false,
      fps: 0,
      randomSeed: 27,
      stepCount: 0,
      noise: false
    }
  },
  computed: {
    w (): number {
      return Math.pow(2, this.wPow)
    },
    h (): number {
      return Math.pow(2, this.hPow)
    },
    scale (): number {
      return Math.pow(10, this.scalePow)
    }
  },
  methods: {
    togglePlay (): void {
      this.isPlaying = !this.isPlaying
    }
  },
  filters: {
    playbutton (isPlaying: boolean) {
      return isPlaying ? '■ stop' : '▶ play'
    }
  }
})
