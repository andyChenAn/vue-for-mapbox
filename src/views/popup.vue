<template>
  <Map v-bind="data.map">
    <Source v-bind="data.source">
      <Layer v-bind="data.layer" />
    </Source>
    <Popup ref="popup" v-if="data.popup.show" :anchor="data.popup.anchor" :longitude="data.popup.longitude" :latitude="data.popup.latitude" :close-button="data.popup.closeButton" :onClose="data.popup.onClose" :onOpen="data.popup.onOpen">
      <div class="popup">
        <div class="inner">
          <div class="title">{{data.popup.title}}</div>
          <div class="content">{{data.popup.content}}</div>
        </div>
      </div>
    </Popup>
  </Map>
</template>

<script lang='ts' setup>
import Map , { Source , Layer , Popup } from '@/vue-for-mapbox';
import { MapLayerMouseEvent } from 'mapbox-gl';
import { nextTick, onMounted, reactive , ref } from 'vue';
const popup = ref(null);
const data = reactive({
  popup : {
    show : false,
    longitude : 113.2334,
    latitude : 23.3443,
    onClose () {
      data.popup.show = false;
    },
    onOpen () {
      console.log(popup.value.getPopup());
    },
    closeButton : false,
    title : '这是一个弹框',
    content : '这是弹框的内容',
    anchor : 'bottom'
  },
  map : {
    cameraAttribute : {
      zoom : 14,
      center : [113.2334 , 23.3443],
      pitch : 0,
      bearing : 0
    },
    interactiveLayerIds : ['point'],
    onClick (evt: MapLayerMouseEvent) {
      if (evt.features?.length > 0) {
        data.popup.show = true;
      }
    },
    mapStyle : 'mapbox://styles/mapbox/streets-v9',
    accessToken : 'pk.eyJ1IjoiZXRlcm5pdHkteHlmIiwiYSI6ImNqaDFsdXIxdTA1ODgycXJ5czdjNmF0ZTkifQ.zN7e588TqZOQMWfws-K0Yw',
  },
  source : {
    type : 'geojson',
    data : {
      type : 'FeatureCollection',
      features : [
        {
          type : 'Feature',
          properties : {
            name : 'andy',
            age : 23
          },
          geometry : {
            type : 'Point',
            coordinates : [113.2334 , 23.3443]
          }
        }
      ]
    }
  },
  layer : {
    id : 'point',
    type : 'circle',
    paint : {
      'circle-color' : '#f60'
    }
  }
})

</script>

<style lang='less' scoped>
.popup {
  width: 400px;
  height: 300px;
  background-color: #000;
  color: #fff;
}
</style>