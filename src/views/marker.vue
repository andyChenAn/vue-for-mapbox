<template>
  <Map v-bind="data.map">
    <Marker v-bind="data.marker">
      <div>这是一个marker</div>
    </Marker>
    <Popup v-if="data.popup.show" :onClose="data.popup.onClose" :longitude="data.popup.longitude" :latitude="data.popup.latitude">
      <div>这是一个弹框</div>
    </Popup>
  </Map>
</template>
<script lang='ts' setup>
import Map , {  Marker , Popup } from '@/vue-for-mapbox';
import { reactive , ref } from 'vue';
const popup = ref();
const data = reactive({
  map : {
    cameraAttribute : {
      zoom : 14,
      center : [113.2334 , 23.3443],
      pitch : 0,
      bearing : 0
    },
    mapStyle : 'mapbox://styles/mapbox/streets-v9',
    accessToken : 'pk.eyJ1IjoiZXRlcm5pdHkteHlmIiwiYSI6ImNqaDFsdXIxdTA1ODgycXJ5czdjNmF0ZTkifQ.zN7e588TqZOQMWfws-K0Yw',
  },
  marker : {
    longitude : 113.2334,
    latitude : 23.3443,
    draggable: true,
    onDrag (evt) {
      const { lat , lng } = evt.target.getLngLat();
      data.popup.longitude = lng;
      data.popup.latitude = lat;
    },
    onClick () {
      data.popup.show = true;
    }
  },
  popup : {
    show : false,
    longitude : 113.2334,
    latitude : 23.3443,
    onClose () {
      data.popup.show = false;
    },
    closeButton : false,
    anchor : 'bottom'
  }
});
</script>

<style lang='less' scoped>
</style>