<template>
  <div class="tool-box">
  </div>
  <Map :cameraAttribute="data.cameraAttribute"></Map>
</template>

<script lang='ts' setup>
import Map from '@/vue-for-mapbox';
import { reactive } from 'vue';
const data = reactive({
  cameraAttribute : {
    center : [113.4534, 23.4143],
    zoom : 15,
  },
})
</script>

<style lang='less' scoped>
</style>