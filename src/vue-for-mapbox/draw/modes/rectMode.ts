import * as constants from '@mapbox/mapbox-gl-draw/src/constants';
import { enable , disable } from '../utils/dragPan';
import * as turfHelpers from '@turf/helpers';
import type { Feature } from '../../types';
import { featureCollection , point , envelope } from '@turf/turf';
const RectMode: MapboxDraw.DrawCustomMode = {
  onSetup (options) {
    const polygon = this.newFeature({
      type : constants.geojsonTypes.FEATURE,
      properties : {
        isRect : true,
        point : []
      },
      geometry : {
        type : constants.geojsonTypes.POLYGON,
        coordinates : [[]]
      }
    });
    disable(this);
    this.addFeature(polygon);
    this.clearSelectedFeatures();
    this.activateUIButton(constants.geojsonTypes.POLYGON);
    this.updateUIClasses({
      mouse : constants.cursors.ADD
    });
    this.setActionableState({
      trash : true,
      combineFeatures : false,
      uncombineFeatures : false
    });
    return {
      polygon
    }
  },
  onMouseDown (state , evt) {
    const point = state.polygon.properties.point;
    if (point.length === 0) {
      state.polygon.properties.point = [evt.lngLat.lng , evt.lngLat.lat];
    }
  },
  onMouseUp (state , evt) {
    enable(this);
    state.polygon.properties.endPoint = [evt.lngLat.lng , evt.lngLat.lat];
    return this.changeMode('simple_select' , {
      featureIds : [state.polygon.id]
    });
  },
  onDrag (state , evt) {
    const firstPoint = state.polygon.properties.point;
    if (firstPoint.length > 0) {
      const rectFeatures = featureCollection([point(firstPoint) , point([evt.lngLat.lng , evt.lngLat.lat])]);
      const feature = envelope(rectFeatures);
      state.polygon.incomingCoords(feature.geometry.coordinates);
    }
  },
  toDisplayFeatures (state , geojson: Feature , display) {
    if (geojson.properties) {
      const isActive = state.polygon.id === geojson.properties?.id;
      geojson.properties.active = isActive ? constants.activeStates.ACTIVE : constants.activeStates.INACTIVE;
      return display(geojson);
    }
  }
};
export default RectMode;