import createCircleVertex from '../utils/createCircleVertex';
import createSupplementaryPoints from '@mapbox/mapbox-gl-draw/src/lib/create_supplementary_points';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as constants from '@mapbox/mapbox-gl-draw/src/constants';
import moveFeatures from '@mapbox/mapbox-gl-draw/src/lib/move_features';
import type { Feature } from '../../types';
import createRectVertex from '../utils/createRectVertex';
const SimpleSelectMode: MapboxDraw.DrawCustomMode = {
  ...(MapboxDraw.modes as any).simple_select,
  // 当拖动圆圈时，要重新更新圆圈的中心点
  dragMove (state: any , evt: any) {
    state.dragMoving = true;
    // 计算差值
    const diff = {
      lng : evt.lngLat.lng - state.dragMoveLocation.lng,
      lat : evt.lngLat.lat - state.dragMoveLocation.lat
    };
    // @ts-ignore
    moveFeatures(this.getSelected() , diff);
    // @ts-ignore  圆形
    this.getSelected()
    .filter((feature: Feature) => feature.properties?.isCircle)
    .map((item: Feature) => item.properties?.center)
    .map((center: number[]) => {
      center[0] += diff.lng;
      center[1] += diff.lat;
      return center;
    });
    // @ts-ignore  矩形
    this.getSelected()
    .filter((feature: Feature) => feature.properties?.isRect)
    .map((item: Feature) => {
      let point = item.properties?.point;
      let endPoint = item.properties?.endPoint;
      point[0] += diff.lng;
      point[1] += diff.lat;
      endPoint[0] += diff.lng;
      endPoint[1] += diff.lat;
      return item;
    })
    state.dragMoveLocation = evt.lngLat;
  },
  toDisplayFeatures (state , geojson: Feature , display) {
    if (geojson.properties) {
      geojson.properties.active = this.isSelected(geojson.properties.id) ? constants.activeStates.ACTIVE : constants.activeStates.INACTIVE;
      display(geojson);
      // geojson.properties.active !== constants.activeStates.ACTIVE主要是判断当形状处于非激活状态时，那么就需要删除掉顶点，其实也就是不渲染顶点
      if (geojson.properties.active !== constants.activeStates.ACTIVE || geojson.geometry.type === constants.geojsonTypes.POINT) {
        return;
      }
      // 创建顶点
      let points: any[];
      if (geojson.properties.user_isCircle) {
        points = createCircleVertex(geojson);
      } else if (geojson.properties.user_isRect) {
        points = createRectVertex(geojson);
      } else {
        points = createSupplementaryPoints(geojson);
      }
      points.forEach(display);
    }
  }
}
export default SimpleSelectMode;