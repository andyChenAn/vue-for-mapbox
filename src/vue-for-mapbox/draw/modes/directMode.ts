import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { Feature } from '../../types';
import * as constants from '@mapbox/mapbox-gl-draw/src/constants';
import createCircleVertex from '../utils/createCircleVertex';
import createRectVertex from '../utils/createRectVertex';
import createSupplementaryPoints from '@mapbox/mapbox-gl-draw/src/lib/create_supplementary_points';
import constrainFeatureMovement from '@mapbox/mapbox-gl-draw/src/lib/constrain_feature_movement';
import { distance , circle , featureCollection , envelope , point } from '@turf/turf';
import moveFeatures from '@mapbox/mapbox-gl-draw/src/lib/move_features';
import * as turfHelpers from '@turf/helpers';
import deepEqual from '../../utils/deepEqual';
const DirectMode: MapboxDraw.DrawCustomMode = {
  ...(MapboxDraw.modes as any).direct_select,
  dragFeature (state: any , evt: any , delta: any) {
    // @ts-ignore
    moveFeatures(this.getSelected() , delta);
    // @ts-ignore
    this.getSelected()
    .filter((feature: Feature) => feature.properties?.isCircle)
    .map((item: Feature) => item.properties?.center)
    .map((center: number[]) => {
      center[0] += delta.lng;
      center[1] += delta.lat;
      return center;
    });
    // @ts-ignore
    this.getSelected()
    .filter((feature: Feature) => feature.properties?.isRect)
    .map((item: Feature) => {
      let point = item.properties?.point;
      let endPoint = item.properties?.endPoint;
      point[0] += delta.lng;
      point[1] += delta.lat;
      endPoint[0] += delta.lng;
      endPoint[1] += delta.lat;
      return item;
    })
    state.dragMoveLocation = evt.lngLat;
  },
  dragVertex (state: any , evt: any , delta: any) {
    if (state.feature.properties.isCircle) {
      // 如果是圆圈
      const center = state.feature.properties.center;
      const movePoint = [evt.lngLat.lng , evt.lngLat.lat];
      const radius = distance(turfHelpers.point(center) , turfHelpers.point(movePoint) , {units : 'kilometers'});
      const circleGeojson = circle(center , radius);
      state.feature.incomingCoords(circleGeojson.geometry.coordinates);
      state.feature.properties.radius = radius;
    } else if (state.feature.properties.isRect) {
      // 如果是矩形
      const pathIndex = state.selectedCoordPaths[0].split('.')[1];
      const firstPoint = state.feature.properties.point;
      if (deepEqual(state.feature.coordinates[0][pathIndex] , firstPoint)) {
        return;
      };
      const rectFeatures = featureCollection([point(firstPoint) , point([evt.lngLat.lng , evt.lngLat.lat])]);
      const feature = envelope(rectFeatures);
      state.feature.incomingCoords(feature.geometry.coordinates);
      state.feature.properties.endPoint = [evt.lngLat.lng , evt.lngLat.lat];
    }  else {
      const selectedCoords = state.selectedCoordPaths.map((coordPath: string[]) => {
        state.feature.getCoordinate(coordPath);
      });
      const selectedCoordPoints = selectedCoords.map((coords: any[]) => {
        return {
          type : constants.geojsonTypes.FEATURE,
          properties : {},
          geometry : {
            type : constants.geojsonTypes.POINT,
            coordinates : coords
          }
        }
      });
      const constraineDelta = constrainFeatureMovement(selectedCoordPoints , delta);
      for (let i = 0 ; i < selectedCoords.length ; i++) {
        const coord = selectedCoords[i];
        state.feature.updateCoodinate(state.selectedCoordPaths[i] , coord[0] + constraineDelta.lng , coord[1] + constraineDelta.lat);
      }
    }
  },
  toDisplayFeatures (state , geojson: Feature , display) {
    if (geojson.properties) {
      if (state.featureId === geojson.properties.id) {
        geojson.properties.active = constants.activeStates.ACTIVE;
        let points: any[];
        if (geojson.properties.user_isCircle) {
          points = createCircleVertex(geojson);
        } else if (geojson.properties.user_isRect) {
          points = createRectVertex(geojson);
        } else {
          points = createSupplementaryPoints(geojson);
        }
        points.forEach(display);
      } else {
        geojson.properties.active = constants.activeStates.INACTIVE;
      }
      display(geojson);
    }
  }
}
export default DirectMode;