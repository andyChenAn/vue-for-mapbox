import * as turfHelpers from '@turf/helpers';
import { circle , distance } from '@turf/turf';
import { disable , enable } from '../utils/dragPan';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { DrawCustomFeature , Feature } from '../../types';
import * as constants from '@mapbox/mapbox-gl-draw/src/constants';
let featureId = '';
const CircleMode: MapboxDraw.DrawCustomMode = {
  onSetup (options) {
    const feature: DrawCustomFeature = this.getFeature(featureId);
    // 如果多次点击绘制圆圈按钮，那么会删除上一个feature
    if (feature && feature.properties?.center.length === 0) {
      this.deleteFeature(featureId);
    }
    // 创建polygon feature
    const polygon: DrawCustomFeature = this.newFeature({
      type : constants.geojsonTypes.FEATURE,
      properties : {
        center : [],
        isCircle : true,
      },
      geometry : {
        type : constants.geojsonTypes.POLYGON,
        coordinates : [[]]
      }
    });
    this.clearSelectedFeatures();
    // 禁止地图拖动
    disable(this);
    // 将polygon feature添加到map中
    this.addFeature(polygon);
    this.activateUIButton(constants.types.POLYGON);
    this.updateUIClasses({
      mouse : constants.cursors.ADD
    });
    this.setActionableState({
      trash : true,
      combineFeatures : false,
      uncombineFeatures : false
    });
    featureId = polygon.id as string;
    return {
      polygon
    }
  },
  onMouseDown (state , evt) {
    // 中心点
    const center = state.polygon.properties.center;
    if (center.length === 0) {
      // 没有中心点，那么就创建中心点
      state.polygon.properties.center = [evt.lngLat.lng , evt.lngLat.lat];
    }
  },
  onDrag (state , evt) {
    const center = state.polygon.properties.center;
    if (center.length > 0) {
      // 如果存在中心点，那么就计算圆的半径
      const radius = distance(turfHelpers.point(center) , turfHelpers.point([evt.lngLat.lng , evt.lngLat.lat]) , {units : 'kilometers'});
      const circleGeojson = circle(center , radius);
      state.polygon.incomingCoords(circleGeojson.geometry.coordinates);
      state.polygon.properties.radius = radius;
    }
  },
  onClick (state , evt) {
   state.polygon.properties.center = [];
  },
  onMouseUp (state , evt) {
    // 允许地图拖动
    enable(this);
    // 当鼠标放开时，我们需要将mode切换到simple_mode
    return this.changeMode('simple_select' , {
      featureIds : [state.polygon.id]
    });
  },
  toDisplayFeatures (state , geojson: Feature , display) {
    // if (geojson.properties?.user_center.length === 0) {
    //   return;
    // }
    if (geojson.properties) {
      const active = geojson.properties.id === state.polygon.id ? 'true' : 'false';
      geojson.properties.active  = active;
      // 当执行changeMode方法，进行模式切换时，toDisplayFeatures方法会执行，这个时候，我们只需要display原来已经绘制的形状
      // 对于正要绘制的形状，我们等到用户进行下一次操作的时候进行，这样避免执行changeMode时，上一个形状在不选择的情况下会被隐藏掉
      if (active === 'false') {
        return display(geojson);
      };
      // 渲染当前绘制的形状
      if (active === 'true' && geojson.properties.user_center.length > 0) {
        return display(geojson);
      }
    }
  } 
};
export default CircleMode;