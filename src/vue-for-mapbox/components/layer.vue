<template></template>

<script lang='ts' setup>
import { inject, onMounted, onBeforeUpdate, reactive, watch } from 'vue';
import { MapboxMap , MapLayerMouseEvent } from '../types';
import filter from '../utils/filter';
import deepEqual from '../utils/deepEqual';
type LayerProps = {
  id: string;
  type: 'fill' | 'line' | 'symbol' | 'circle' | 'heatmap' | 'fill-extrusion' | 'raster' | 'hillshade' | 'background' | 'sky';
  filter?: any;
  layout?: any;
  paint?: any;
  source?: string;
  sourceLayer?: string;
  metadata?: any;
  minzoom?: number;
  maxzoom?: number;
  beforeId?: string;
};

const props = withDefaults(defineProps<LayerProps>() , {
  layout : {},
  paint : {}
});
let layerProps = filter(props);
let prevLayerProps = reactive({...layerProps});
const getSourceId = inject('getSourceId');
// @ts-ignore
const sourceId = getSourceId();
const mapboxContext: any = inject('mapboxContext');

watch(props , () => {
  layerProps = filter(props);
});

function createLayer (map: MapboxMap , layerId: string , props: LayerProps) {
  if (map.getSource(sourceId)) {
    const layerOptions: LayerProps = {...layerProps};
    layerOptions.source = sourceId;
    delete layerOptions.beforeId;
    layerOptions.sourceLayer && (layerOptions['source-layer'] = layerOptions.sourceLayer);
    delete layerOptions.sourceLayer;
    map.addLayer(layerOptions , props.beforeId);
  }
}

function updateLayer (map: MapboxMap , layerId: string , props: LayerProps , prevProps: LayerProps) {
  const { beforeId , layout = {} , paint = {} } = props;
  if (beforeId !== prevProps.beforeId) {
    map.moveLayer(layerId , beforeId);
  };
  if (!deepEqual(layout , prevProps.layout)) {
    for (let key in layout) {
      if (!deepEqual(layout[key] , prevProps.layout[key])) {
        map.setLayoutProperty(layerId , key , layout[key]);
      }
    };
    for (let key in prevProps.layout) {
      if (!layout.hasOwnProperty(key)) {
        map.setLayoutProperty(layerId , key , undefined);
      }
    };
  };
  if (!deepEqual(paint , prevProps.paint)) {
    for (let key in paint) {
      if (!deepEqual(paint[key] , prevProps.paint[key])) {
        map.setPaintProperty(layerId , key , paint[key]);
      }
    };
    for (let key in prevProps.paint) {
      if (!paint.hasOwnProperty(key)) {
        map.setPaintProperty(layerId , key , undefined);
      }
    }
  };
  if (!deepEqual(props.filter , prevProps.filter)) {
    map.setFilter(layerId , props.filter);
  };
  if (props.minzoom !== prevProps.minzoom || props.maxzoom !== prevProps.maxzoom) {
    map.setLayerZoomRange(layerId , props.minzoom as number , props.maxzoom as number);
  }
}

onMounted(() => {
  const { id } = layerProps;
  if (mapboxContext.value) {
    const map = mapboxContext.value.map;
    const layer = map.getLayer(id);
    if (layer) {
      // 更新
      updateLayer(map , id , layerProps , prevLayerProps)
    } else {
      // 创建
      createLayer(map , id , layerProps);
    }
    prevLayerProps = Object.assign(prevLayerProps , layerProps);
  }
})
</script>

<style lang='less' scoped>
</style>