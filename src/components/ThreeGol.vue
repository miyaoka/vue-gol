<template>
  <div>
    <div>
      <button
        @click="togglePlay"
      >{{isPlaying | playbutton}}</button>
      {{fps | round}}
      AmbientLight<input type="checkbox" v-model="ambientLight.visible">
      <input type="range" v-model="ambientLight.intensity" min="0" max="1" step="any">
      DirectionalLight<input type="checkbox" v-model="directionalLight.visible">
      <input type="range" v-model="directionalLight.intensity" min="0" max="1" step="any">
      Floor<input type="checkbox" v-model="floor.visible">

      | Guides:
      Axis<input type="checkbox" v-model="axisHelper.visible">
      Grid<input type="checkbox" v-model="gridHelper.visible">
    </div>

    <div ref="container"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls'

let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let scene: THREE.Scene
let cube: THREE.Mesh
let controls: THREE.OrbitControls
let fpsList: number[] = []
const fpsSampleCount = 30

export default Vue.extend({
  components: {
  },
  data () {
    return {
      w: 640,
      h: 480,
      animationID: 0,
      fps: 0,
      ambientLight: new THREE.AmbientLight(0xffffcc, 0.1),
      directionalLight: new THREE.DirectionalLight(0xffffff, 0.8),
      floor: new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200, 1, 1),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      ),
      gridHelper: new THREE.GridHelper(200, 10),
      axisHelper: new THREE.AxisHelper(200)
    }
  },
  created () {
    // init renderrer
    renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setSize(this.w, this.h)
    renderer.setClearColor(0xffffee)

    // init camera
    // camera = new THREE.OrthographicCamera(-this.halfW, this.halfW, this.halfH, -this.halfH, 1, 1000)
    camera = new THREE.PerspectiveCamera(50, this.aspect, 0.1, 1000)
    camera.position.set(50, 200, 100)

    // init scene
    scene = new THREE.Scene()
    cube = new THREE.Mesh(
      new THREE.BoxGeometry(30, 20, 10),
      new THREE.MeshLambertMaterial({ color: 0x00cc00 })
    )
    cube.position.y = 30
    cube.receiveShadow = true

    this.floor.rotation.x = -Math.PI / 2

    this.directionalLight.position.set(50, 200, 0)

    // shadow
    // renderer.shadowMap.enabled = true
    // this.directionalLight.castShadow = true
    // this.floor.receiveShadow = true
    // cube.castShadow = true

    scene.add(
      this.gridHelper,
      this.axisHelper,
      this.ambientLight,
      this.directionalLight,
      new THREE.DirectionalLightHelper(this.directionalLight, 10),
      this.floor,
      cube
    )
  },
  mounted () {
    const container = this.$refs.container as HTMLElement
    container.appendChild(renderer.domElement)

    controls = new THREE.OrbitControls(camera, renderer.domElement)

    this.play()
  },
  computed: {
    halfW (): number {
      return this.w / 2
    },
    halfH (): number {
      return this.h / 2
    },
    aspect (): number {
      return this.w / this.h
    },
    isPlaying (): boolean {
      return this.animationID !== 0
    }
  },
  methods: {
    play (): void {
      fpsList = [performance.now()]
      this.update()
    },
    update (): void {
      fpsList = [...fpsList, performance.now()]
      .slice(-fpsSampleCount)

      const diffSum = fpsList.slice(1)
      .map((val: number, i: number, ary: number[]) => val - fpsList[i])
      .reduce((prev: number, curr: number) => prev + curr)

      this.fps = 1000 / (diffSum / (fpsList.length - 1))

      this.animationID = requestAnimationFrame(this.update)
      this.render()
    },
    stop (): void {
      cancelAnimationFrame(this.animationID)
      this.animationID = 0
    },
    togglePlay (): void {
      this.isPlaying ? this.stop() : this.play()
    },
    render (): void {
      controls.update()
      cube.rotation.x += 0.05
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
  },
  filters: {
    playbutton (isPlaying: boolean) {
      return isPlaying ? '■ stop' : '▶ play'
    },
    round (num: number): string {
      return Math.round(num).toString()
    }
  }
})
</script>

<style>
</style>
