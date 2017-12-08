<template>
  <div class="container">
    <div class="control">
      <div>
        w:<input type="range" v-model.number="wPow" min="1" max="12" step="1">
        h:<input type="range" v-model.number="hPow" min="1" max="12" step="1">
        [{{w}}x{{h}}]

        <input type="range" v-model.number="scalePow" min="-1.5" max="1.5" step="any">
        x{{scale.toFixed(1)}}

        <button
          class="btn"
          @click="togglePlay"
        >{{isPlaying | playbutton}}</button>
      </div>
      <div>
        seed: <input type="range" v-model.number="randomSeed" min="3" max="500">
        [{{randomSeed}}]
        <button
          @click="randomSeed=Math.floor(Math.random()*50)+3"
        >random</button>
        <label>
          noise:<input type="checkbox" v-model="noise">
        </label>
        |
        {{stepCount}}steps,
        {{fps.toFixed(0)}}fps
      </div>
    </div>

    <div
      class="gol"
    >
      <wgl-gol
        :w="w"
        :h="h"
        :scale="scale"
        :noise="noise"
        :isPlaying.sync="isPlaying"
        :fps.sync="fps"
        :randomSeed.sync="randomSeed"
        :stepCount.sync="stepCount"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./WglGolWrapper">
</script>

<style scoped>
.btn {
  width: 100px;
  font-size: 20px;
  position: relative;
  display: inline-block;
  padding: 0.25em 0.5em;
  text-decoration: none;
  color: #FFF;
  background: #fd9535;/*色*/
  border-radius: 4px;/*角の丸み*/
  box-shadow: inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.05);
  font-weight: bold;
  border: solid 2px #d27d00;/*線色*/
}

.btn:active {/*押したとき*/
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.30);
}
.container {
  position: relative;
}
.control {
  background:#fff;
  z-index:100;
}
.gol {
  display: inline-block;
  border: 2px solid;
  /* margin-top:64px; */
}
</style>
