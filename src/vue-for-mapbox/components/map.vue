<template>
  <div class="map" ref="containerRef"></div>
  <slot v-if="mapboxContext" />
</template>

<script lang='ts' setup>
import mapboxgl from 'mapbox-gl';
import { onMounted , withDefaults , provide , ref, onBeforeUnmount , watch } from 'vue';
import Mapbox from '../mapbox/mapbox';
import find from '../utils/find';
import setGlobals from '../utils/setGlobals';
import type { 
  Light , 
  Fog , 
  TerrainSpecification , 
  LngLatBoundsLike , 
  CameraAttribute , 
  MapboxEvent , 
  MapLayerMouseEvent , 
  MapBoxZoomEvent,
  MapStyleDataEvent,
  MapSourceDataEvent,
  ErrorEvent,
  MapWheelEvent,} from '../types';
type MapboxProps = {
  accessToken?: string;
  cursor?: string;
  mapStyle?: string;
  minZoom?: number;
  maxZoom?: number;
  hash?: boolean;
  light?: Light;
  fog?: Fog | null;
  terrain?: TerrainSpecification | null;
  interactive?: boolean;
  bearingSnap?: number;
  interactiveLayerIds?: string[];
  pitchWithRotate?: boolean;
  renderWorldCopies?: boolean;
  styleDiff?: boolean;
  clickTolerance?: number;
  attributionControl?: boolean;
  customAttribution?: string | string[];
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  failIfMajorPerformanceCaveat?: boolean;
  preserveDrawingBuffer?: boolean;
  antialias?: boolean;
  refreshExpiredTiles?: boolean;
  maxBounds?: LngLatBoundsLike;
  scrollZoom?: boolean;
  boxZoom?: boolean;
  dragRotate?: boolean;
  dragPan?: boolean;
  keyboard?: boolean;
  doubleClickZoom?: boolean;
  touchZoomRotate?: boolean;
  trackResize?: boolean;
  baseApiUrl?: string;
  localIdeographFontFamily?: string;
  workerCount?: number;
  maxParallelImageRequests?: number;
  reuse?: boolean;
  // 相机属性
  cameraAttribute?: Partial<CameraAttribute>;
  onClick?: (evt: MapLayerMouseEvent) => void;
  onMouseDown?: (evt: MapLayerMouseEvent) => void;
  onMouseUp?: (evt: MapLayerMouseEvent) => void;
  onDblClick?: (evt: MapLayerMouseEvent) => void;
  onMouseMove?: (evt: MapLayerMouseEvent) => void;
  onMouseEnter?: (evt: MapLayerMouseEvent) => void;
  onMouseLeave?: (evt: MapLayerMouseEvent) => void;
  onMouseOver?: (evt: MapLayerMouseEvent) => void;
  onMouseOut?: (evt: MapLayerMouseEvent) => void;
  onContextMenu?: (evt: MapLayerMouseEvent) => void;

  onMoveStart?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onMove?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onMoveEnd?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onDragStart?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onDrag?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onDragEnd?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onZoomStart?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onZoom?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onZoomEnd?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onRotateStart?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onRotate?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onRotateEnd?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onPitchStart?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onPitch?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onPitchEnd?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;

  onWheel?: (evt: MapWheelEvent) => void;
  onBoxZoomStart?: (evt: MapBoxZoomEvent) => void;
  onBoxZoomCancel?: (evt: MapBoxZoomEvent) => void;
  onBoxZoomEnd?: (evt: MapBoxZoomEvent) => void;
  onResize?: (evt: MapboxEvent) => void;
  onLoad?: (evt: MapboxEvent) => void;
  onIdle?: (evt: MapboxEvent) => void;
  onRemove?: (evt: MapboxEvent) => void;
  onRender?: (evt: MapboxEvent) => void;
  onStyleData?: (evt: MapStyleDataEvent) => void;
  onSourceData?: (evt: MapSourceDataEvent) => void;
  onError?: (evt: ErrorEvent) => void;
  onDataLoading?: (evt: MapSourceDataEvent) => void;
  onStyleDataLoading?: (evt: MapStyleDataEvent) => void;
  onSourceDataLoading?: (evt: MapSourceDataEvent) => void;
  onStyleImageMissing?: (evt: any) => void;
  [key: string]: any;
}
// mapbox的全局配置
type GlobalSettings = {
  baseApiUrl?: string;
  workerCount?: number;
  maxParallelImageRequests?: number;
}
const props = withDefaults(defineProps<MapboxProps>() , {
  minZoom : 0,
  maxZoom : 22,
  hash : false,
  interactive : true,
  bearingSnap : 7,
  pitchWithRotate : true,
  clickTolerance : 3,
  attributionControl : true,
  customAttribution : '',
  logoPosition : 'bottom-left',
  failIfMajorPerformanceCaveat : false,
  preserveDrawingBuffer : false,
  antialias : false,
  refreshExpiredTiles : true,
  scrollZoom : true,
  boxZoom : true,
  dragRotate : true,
  dragPan : true,
  keyboard : true,
  doubleClickZoom : true,
  touchZoomRotate : true,
  trackResize : true,
  renderWorldCopies : true,
  maxTileCacheSize : null,
  localIdeographFontFamily : 'sans-serif',
  transformRequest : null,
  collectResourceTiming : false,
  fadeDuration : 300,
  crossSourceCollisions : true,
  styleDiff : true,
  cameraAttribute : {
    center : [0 , 0],
    padding : {
      top : 0,
      left : 0,
      right : 0,
      bottom : 0
    },
    zoom : 0,
    pitch : 0,
    bearing : 0
  },
  reuse : true,
});
const containerRef = ref();
const mapboxContext = ref();
provide('mapboxContext' , mapboxContext);
watch(props , () => {
  if (mapboxContext.value) {
    mapboxContext.value.updateProps({...props});
  }
})
defineExpose({
  mapboxContext : mapboxContext
});
onMounted(() => {
  if (!mapboxgl.supported()) {
    throw new Error('该浏览器不支持mapbox');
  } else {
    // 过滤传入的props
    let mapboxProps: MapboxProps = {};
    for (let key in props) {
      if (key !== undefined) {
        mapboxProps[key] = props[key]
      }
    };
    // 设置全局配置
    const globalSettings: GlobalSettings = find<GlobalSettings>(props , ['baseApiUrl' , 'workerCount' , 'maxParallelImageRequests']);
    setGlobals(mapboxgl , globalSettings);
    if (mapboxProps.reuse) {
      // 复用mapbox
      mapboxContext.value = Mapbox.reuse(containerRef.value , mapboxProps);
    };
    if (!mapboxContext.value) {
      mapboxContext.value = new Mapbox(mapboxgl.Map , mapboxProps , containerRef.value);
    }
  }
})
onBeforeUnmount(() => {
  if (mapboxContext.value) {
    if (props.reuse) {
      mapboxContext.value.recycle();
    } else {
      mapboxContext.value.destroy();
    }
  }
})
</script>

<style lang='less' scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>