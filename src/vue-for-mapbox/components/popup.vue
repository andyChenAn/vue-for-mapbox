<template>
  <div ref="popupContainer">
    <slot />
  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref , inject, onBeforeUnmount, watch } from 'vue';
import mapboxgl from 'mapbox-gl';
import deepEqual from '../utils/deepEqual';
const popupContainer = ref();
type PopupProps = {
  longitude: number;
  latitude: number;
  closeButton?: boolean;
  closeOnClick?: boolean;
  anchor?: string;
  offset?: any;
  className?: string;
  maxWidth?: string;
  onClose?: () => void;
  onOpen?: () => void;
}
const props: PopupProps = withDefaults(defineProps<PopupProps>() , {
  closeButton : true,
  closeOnClick : true,
  maxWidth : 'auto',
});
let prevProps: PopupProps = {...props};

const popupEvents = {
  close : 'onClose',
  open : 'onOpen'
};

const mapboxContext: any = inject('mapboxContext');
const popup: any = ref(null);

watch(props , () => {
  updatePopup(props);
});

// 导出popup对象
defineExpose({
  getPopup () {
    return popup.value;
  }
});

function updatePopup (props: PopupProps) {
  if (popup.value) {
    const { longitude , latitude , maxWidth } = props;
    if (!deepEqual(props.longitude , prevProps.longitude) || !deepEqual(props.latitude , prevProps.latitude)) {
      popup.value.setLngLat([props.longitude , props.latitude]);
    };
    if (!deepEqual(props.maxWidth , prevProps.maxWidth)) {
      popup.value.setMaxWidth(props.maxWidth);
    }
    prevProps = Object.assign({} , prevProps , props);
  }
}


function wrapperPopupEvents (evt: any) {
  // @ts-ignore
  const handler = props[popupEvents[evt.type]];
  if (handler) {
    handler(evt);
  }
}

onMounted(() => {
  const map = mapboxContext.value.map;
  const html = popupContainer.value.children[0];
  popup.value = new mapboxgl.Popup(props);
  for (let eventName in popupEvents) {
    popup.value.on(eventName , wrapperPopupEvents)
  }
  popup.value.setLngLat([props.longitude , props.latitude]).setDOMContent(html).addTo(map);
});
onBeforeUnmount(() => {
  popup.value.remove();
})

</script>

<style lang='less' scoped>
</style>