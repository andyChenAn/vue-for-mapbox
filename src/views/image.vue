<template>
  <Map v-bind="mapOptions" :cameraAttribute="cameraAttribute">
    <Source v-bind="imageSource.data">
      <Layer v-bind="layerData" />
    </Source>
  </Map>
</template>

<script lang='ts' setup>
import { reactive } from 'vue';
import Map , { Source , Layer } from '@/vue-for-mapbox';
const imageSource = reactive({
  data : {
  type : 'image',
    url : require('@/assets/images/1.png'),
    coordinates : [
      [-80.425, 46.437],
      [-71.516, 46.437],
      [-71.516, 37.936],
      [-80.425, 37.936]
    ]
  }
});
const mapOptions = {
  accessToken: 'pk.eyJ1IjoiZXRlcm5pdHkteHlmIiwiYSI6ImNqaDFsdXIxdTA1ODgycXJ5czdjNmF0ZTkifQ.zN7e588TqZOQMWfws-K0Yw',
  mapStyle: 'mapbox://styles/mapbox/streets-v9',
}
const layerData = {
  id: 'image',
  type : 'raster',
  paint : {
    'raster-fade-duration': 0,
    'raster-brightness-min' : 0.5
  }
}
const cameraAttribute = {
  center : [-71.516, 37.936],
  zoom : 6,
  pitch : 0,
  bearing : 0
};
setTimeout(() => {
  imageSource.data.url = 'https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif';
} , 5000);
</script>

<style lang='less' scoped>
</style>