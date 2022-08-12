<template>
  <Map ref="mapRef" v-bind="data.map"></Map>
  <div class="draw-box">
    <button class="btn" @click="drawCircle">draw circle</button>
    <button @click="deleteDraw">delete draw</button>
    <button @click="addDraw">add draw</button>
  </div>
</template>

<script lang='ts' setup>
import Map from '@/vue-for-mapbox';
import { reactive , ref , onMounted } from 'vue';
import type { Feature } from 'geojson';
const mapRef = ref();
const data = reactive({
  map: {
    cameraAttribute: {
      center: [113.4534, 23.4543],
      zoom: 14,
      pitch: 0,
      bearing: 0
    },
    accessToken: 'pk.eyJ1IjoiZXRlcm5pdHkteHlmIiwiYSI6ImNqaDFsdXIxdTA1ODgycXJ5czdjNmF0ZTkifQ.zN7e588TqZOQMWfws-K0Yw',
    mapStyle: 'mapbox://styles/mapbox/streets-v9',
  }
});
const deleteDraw = () => {
  const draw = mapRef.value.mapboxContext.draw;
  const featureIds = draw.getSelectedDraw().features.reduce((list: string[] , item: Feature & {id: string}) => {
    list.push(item.id);
    return list;
  } , [])
  draw.deleteDrawByIds(featureIds);
}
const addDraw = () => {
  const draw = mapRef.value.mapboxContext.draw;
  const features = {
    type : 'Feature',
    properties : {},
    geometry : {
      type : 'Point',
      coordinates : [113.4534, 23.4543]
    }
  };
  draw.add(features);
}
const drawCircle = () => {
  const draw = mapRef.value.mapboxContext.draw;
  draw.drawCircle();
}
</script>

<style lang='less' scoped>
.draw-box {
  position: fixed;
  top: 40px;
  left: 400px;
  .btn {
    cursor: pointer;
  }
}
</style>