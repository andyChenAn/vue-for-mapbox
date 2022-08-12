<template>
  <Map ref="mapRef" v-bind="data.map" />
  <div class="btn-box">
    <button @click="addRect">add a rect</button>
  </div>
</template>

<script lang='ts' setup>
import Map , { Layer , Source } from '@/vue-for-mapbox';
import { ref , reactive } from 'vue';
const data = reactive({
  map : {
    cameraAttribute: {
      center: [113.4534, 23.4543],
      zoom: 14,
      pitch: 0,
      bearing: 0
    },
    accessToken: 'pk.eyJ1IjoiZXRlcm5pdHkteHlmIiwiYSI6ImNqaDFsdXIxdTA1ODgycXJ5czdjNmF0ZTkifQ.zN7e588TqZOQMWfws-K0Yw',
    mapStyle: 'mapbox://styles/mapbox/streets-v9',
  }
})
const mapRef = ref();
const addRect = () => {
  const draw = mapRef.value.mapboxContext.draw;
  draw.drawRect();
}

</script>

<style lang='less' scoped>
.btn-box {
  position: fixed;
  top: 40px;
  left: 400px;
  .btn {
    cursor: pointer;
  }
}
</style>