<template>
  <Map v-bind="mapOptions">
    <Source v-bind="vector.source">
      <Layer v-bind="vector.layer" />
    </Source>
  </Map>
</template>

<script lang='ts' setup>
import { reactive } from 'vue';
import Map, { Source, Layer } from '@/vue-for-mapbox';

const mapOptions = {
  accessToken: 'pk.eyJ1IjoiZXRlcm5pdHkteHlmIiwiYSI6ImNqaDFsdXIxdTA1ODgycXJ5czdjNmF0ZTkifQ.zN7e588TqZOQMWfws-K0Yw',
  mapStyle: 'mapbox://styles/mapbox/streets-v9',
  cameraAttribute : {
    zoom: 13,
    center: [-122.447303, 37.753574],
    bearing : 0,
    pitch : 0
  }
};
const vector = reactive({
  source: {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-terrain-v2'
  },
  layer: {
    id: 'vector',
    type: 'line',
    'source-layer' : 'contour',
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#ff69b4",
      "line-width": 1
    }
  }
})
</script>

<style lang='less' scoped>
</style>