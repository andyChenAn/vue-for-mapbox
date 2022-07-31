<template>
  <div ref="markerContainer">
    <slot />
  </div>
</template>

<script lang='ts' setup>
import mapboxgl from 'mapbox-gl';
import { PointLike , Popup } from '../types';
import { inject , onBeforeUnmount, onMounted , reactive, ref, watch } from 'vue';
import deepEqual from '../utils/deepEqual';
type MarkerProps = {
  longitude: number;
  latitude: number;
  element?: HTMLElement;
  anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offset?: PointLike;
  color?: string;
  draggable?: boolean;
  onDragStart?: () => void;
  onDrag?: () => void;
  onDragEnd?: () => void;
  onClick?: () => void;
  onDblClick?: () => void;
  onMouseUp?: () => void;
  onMouseDown?: () => void;
  onMouseLeave?: () => void;
  onMouseEnter?: () => void;
  onContextMenu?: () => void;
}
const props = withDefaults(defineProps<MarkerProps>() , {
  anchor : 'center',
  color : '#3FB1CE',
  draggable : false
});
const marker = ref();
const markerContainer = ref();
const mapboxContext: any = inject('mapboxContext');
let currentProps: MarkerProps = {...props};
let prevProps: MarkerProps = {...props};

defineExpose({
  getMarker () {
    return marker.value;
  }
});

const markerEvents = {
  dragstart : 'onDragStart',
  drag : 'onDrag',
  dragend : 'onDragEnd'
};

const mouseEvents = {
  click : 'onClick',
  dblclick : 'onDblClick',
  mouseup : 'onMouseUp',
  mousedown : 'onMouseDown',
  mouseleave : 'onMouseLeave',
  mouseenter : 'onMouseEnter',
  contextmenu : 'onContextMenu'
}

watch(props , () => {
  updateMarker(props);
});

function updateMarker (props: MarkerProps) {
  if (marker.value) {
    if (!deepEqual(props.offset , prevProps.offset)) {
      marker.value.setOffset(props.offset);
    };
    if (!deepEqual(props.longitude , prevProps.longitude) || !deepEqual(props.latitude , prevProps.latitude)) {
      marker.value.setLngLat([props.longitude , props.latitude]);
    };
    if (!deepEqual(props.draggable , prevProps.draggable)) {
      marker.value.setDraggable(props.draggable);
    };
    prevProps = Object.assign(prevProps , props);
  }
} 

function wrapperMarkerEvents (evt: any) {
  // @ts-ignore
  const handler = props[markerEvents[evt.type]];
  if (handler) {
    handler(evt);
  }
}

function wrapperMouseEvents (evt: any) {
  if (evt.type === 'dblclick' || evt.type === 'click') {
    evt.stopPropagation();
  }
  // @ts-ignore
  const handler = props[mouseEvents[evt.type]];
  if (handler) {
    handler(evt);
  } 
}

onMounted(() => {
  const map = mapboxContext.value.map;
  const element = markerContainer.value.children[0];
  if (element) {
    currentProps.element = element;
    for (let key in mouseEvents) {
      element.addEventListener(key , wrapperMouseEvents)
    }
  };
  marker.value = new mapboxgl.Marker(currentProps);
  for (let eventName in markerEvents) {
    marker.value.on(eventName , wrapperMarkerEvents)
  }
  marker.value.setLngLat([props.longitude , props.latitude]).addTo(map);
});

onBeforeUnmount(() => {
  if (marker.value) {
    const element = markerContainer.value.children[0];
    if (element) {
      for (let key in mouseEvents) {
        element.removeEventListener(key , wrapperMouseEvents)
      }
    }
    marker.value.remove();
  }
})


</script>

<style lang='less' scoped>
</style>