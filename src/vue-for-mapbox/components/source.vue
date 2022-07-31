<template>
  <slot v-if="source" />
</template>

<script lang='ts' setup>
import { inject , getCurrentInstance , ref, provide, onBeforeUnmount, watch, onBeforeUpdate , reactive, onMounted } from 'vue';
import Mapbox from '../mapbox/mapbox';
import { MapboxMap , AnySourceImpl , GeoJSONSource , ImageSource , VideoSource , VectorSource } from '../types'
import filter from '../utils/filter';
import deepEqual from '../utils/deepEqual';
type SourceProps = {
  id?: string;
  type?: 'vector' | 'raster' | 'raster-dem' | 'geojson' | 'image' | 'video' | 'canvas' | 'custom';
  attribution?: string;
  bounds?: number[];
  maxzoom?: number;
  minzoom?: number;
  scheme?: 'xyz' | 'tms';
  tiles?: string[];
  tileSize?: number;
  url?: string;
  volatile?: boolean;
  coordinates?: number[][];
  urls?: string[]
  buffer?: number;
  cluster?: boolean;
  clusterMaxZoom?: number;
  clusterMinPoints?: number;
  clusterProperties?: any;
  clusterRadius?: number;
  data?: any;
  filter?: any[];
  generateId?: boolean;
  lineMetrics?: boolean;
  promoteId?: any;
  tolerance?: number;
  encoding?: 'terrarium' | 'mapbox';
};
const props = defineProps<SourceProps>();
let sourceProps = reactive(filter(props));
let prevProps = reactive(filter(props));
const mapboxContext: any = inject('mapboxContext');
const source = ref();
const instance = getCurrentInstance();
provide('getSourceId' , () => {
  return sourceProps.id;
});

// 创建数据
function createSource (map: MapboxMap , id: string , props: SourceProps) {
  // @ts-ignore
  if (map.style && map.style._loaded) {
    const sourceOptions = {...props};
    delete sourceOptions.id;
    // @ts-ignore
    map.addSource(id , sourceOptions);
    return map.getSource(id);
  }
  return null;
}
// 生成source的id
function generateSourceId (mapbox: Mapbox) {
  return `map-source-${mapbox.sourceCount++}`;
};

// 更新数据
function updateSource (source: AnySourceImpl , props: SourceProps , prevProps: SourceProps) {
  const type = props.type;
  if (type === 'geojson') {
    (source as GeoJSONSource).setData(props.data);
  } else if (type === 'image') {
    (source as ImageSource).updateImage({
      url : props.url,
      coordinates : props.coordinates
    })
  } else if (type === 'video' || type === 'canvas') {
    if (!deepEqual(props.coordinates , prevProps.coordinates)) {
      (source as VideoSource).setCoordinates(props.coordinates);
    }
  } else if (type === 'vector') {
    if (props.url !== prevProps.url) {
      (source as VectorSource).setUrl(props.url);
    } else if (!deepEqual(props.tiles , prevProps.tiles)) {
      (source as VectorSource).setTiles(props.tiles);
    }
  } else {
    throw new Error('更新失败');
  }
}

onBeforeUpdate(() => {
  sourceProps = Object.assign(sourceProps , filter(props));
  // 判断一下是否存在id，如果不存在就自动生成一个
  !sourceProps.id && (sourceProps.id = generateSourceId(mapboxContext.value));
  if (mapboxContext.value) {
    const map = mapboxContext.value.map;
    const { id } = sourceProps;
    let layerSource = map && map.style && map.getSource(id);
    if (layerSource) {
      // 更新数据
      updateSource(layerSource , sourceProps , prevProps);
    } else {
      // 创建
      source.value = createSource(map , id , sourceProps);
    } 
  }
  prevProps = Object.assign(prevProps , sourceProps);
});

function forceUpdate () {
  const update = () => {
    const map = mapboxContext.value.map;
    let requestId: any;
    if (map.style._loaded) {
      instance.ctx.$forceUpdate();
      cancelAnimationFrame(requestId);
      return;
    }
    requestId = requestAnimationFrame(update);
  }
  update();
};

// 删除地形，当地图存在terrain时，我们切换地图的时候，需要删除当前图层时，需要先删除地形
function removeTerrain () {
  const map = mapboxContext.value.map;
  let terrain = map.getTerrain();
  if (terrain) {
    map.setTerrain();
  }
}

onMounted(() => {
  forceUpdate();
})

onBeforeUnmount(() => {
  // 删除图层和数据
  const map = mapboxContext.value.map;
  if (map.style && map.style._loaded && map.getSource(sourceProps.id)) {
    const allLayers = map.getStyle().layers;
    if (allLayers) {
      for (let layer of allLayers) {
        if (layer.source === sourceProps.id) {
          map.removeLayer(layer.id);
        }
      }
    };
    // 删除地形，这里需要先删除地形（如果有的话），因为删除source的时候，需要先删除地形，再删除source不然就会报错
    removeTerrain();
    map.removeSource(sourceProps.id);
  }
})

</script>

<style lang='less' scoped>
</style>