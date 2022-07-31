<template>
  <Map v-bind="mapOptions" ref="mapRef" :cameraAttribute="cameraAttribute">
    <Source v-bind="videoSource.data">
      <Layer v-bind="layerData" />
    </Source>
  </Map>
</template>

<script lang='ts' setup>
import Map , { Source , Layer } from '@/vue-for-mapbox';
import { onMounted, reactive , ref } from 'vue';
const mapRef = ref(null);
const mapOptions = {
  accessToken: 'pk.eyJ1IjoiZXRlcm5pdHkteHlmIiwiYSI6ImNqaDFsdXIxdTA1ODgycXJ5czdjNmF0ZTkifQ.zN7e588TqZOQMWfws-K0Yw',
  mapStyle: 'mapbox://styles/mapbox/streets-v9',
}
const videoSource = reactive({
  data : {
    type : 'video',
    id : 'video',
    "urls": [
        require('@/assets/video.mp4'),
    ],
    "coordinates": [
        [-122.51596311201019, 37.56238816766053],
        [-122.51467645168304, 37.56410183312965],
        [-122.51309394836426, 37.563391708549425],
        [-122.51423120498657, 37.56161849366671]
    ]
  }
});
const cameraAttribute = reactive({
  zoom : 13,
  center : [-122.51596391201019, 37.56238816766053],
  pitch : 0,
  bearing : 0
})
const layerData = {
  id : 'video',
  type : 'raster',
}
// onMounted(() => {
//   const map = mapRef.value.mapboxContext.map;
//   map.on('click' , () => {
//     const videoDom = map.getSource('video').getVideo();
//     videoDom.muted = false;
//   })
// })
setTimeout(() => {
  videoSource.data.coordinates =  [
       [-76.54, 39.18],
       [-76.52, 39.18],
       [-76.52, 39.17],
       [-76.54, 39.17]
   ];
  cameraAttribute.center = [-76.54, 39.18]
} , 5000)
</script>

<style lang='less' scoped>
</style>