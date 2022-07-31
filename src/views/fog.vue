<template>
  <Map v-bind="data.mapOptions">
    <Source v-bind="data.source">
    </Source>
  </Map>
</template>

<script lang='ts' setup>
import Map , { Source , Layer } from '@/vue-for-mapbox';
import { reactive } from 'vue';
const data =  reactive({
  mapOptions : {
    cameraAttribute : {
      zoom : 13,
      center : [6.6301, 45.35625],
      pitch : 80,
      bearing : 160
    },
    interactive : false,
    fog : {
      range : [-1,2],
      'horizon-blend' : 0.3,
      color : 'white',
      'space-color' : '#d8f2ff',
      'star-intensity' : 0.0
    },
    terrain : {
      source : 'mapbox-dem',
      exaggeration : 1.5
    },
    mapStyle : 'mapbox://styles/mapbox/streets-v9',
    accessToken : 'pk.eyJ1IjoiZXRlcm5pdHkteHlmIiwiYSI6ImNqaDFsdXIxdTA1ODgycXJ5czdjNmF0ZTkifQ.zN7e588TqZOQMWfws-K0Yw',
  },
  source : {
    id : 'mapbox-dem',
    type : 'raster-dem',
    url : 'mapbox://mapbox.terrain-rgb',
    tileSize : 512,
    maxzoom : 14
  }
})

let lastTime = 0.0;
        let animationTime = 0.0;
        let cycleTime = 0.0;
        let night = true;

        const initialBearing = 160;

        function frame(time) {
            const elapsedTime = (time - lastTime) / 1000.0;

            animationTime += elapsedTime;
            cycleTime += elapsedTime;

            if (cycleTime >= 10.0) {
                if (night) {
                    // night fog styling
          
                    data.mapOptions.fog = {
                      'range': [-1, 2],
                        'horizon-blend': 0.3,
                        'color': '#242B4B',
                        'high-color': '#161B36',
                        'space-color': '#0B1026',
                        'star-intensity': 0.8
                    }
                } else {
                    // day fog styling
    
                    data.mapOptions.fog = {
                      'range': [-1, 2],
                        'horizon-blend': 0.3,
                        'color': 'white',
                        'high-color': '#add8e6',
                        'space-color': '#d8f2ff',
                        'star-intensity': 0.0
                    }
                }

                night = !night;
                cycleTime = 0.0;
            }

            const rotation = initialBearing + animationTime * 2.0;
            data.mapOptions.cameraAttribute.bearing = rotation % 360;
            lastTime = time;

            window.requestAnimationFrame(frame);
        }

        window.requestAnimationFrame(frame);
</script>

<style lang='less' scoped>
</style>