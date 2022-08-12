import { Feature } from "geojson";
import createVertex from '@mapbox/mapbox-gl-draw/src/lib/create_vertex';
export default function createCircleVertex (geojson: Feature): any[] {
  const { properties , geometry } = geojson;
  const points = [];
  if (properties) {
    if (!properties.user_isCircle) {
      return [];
    };
    // @ts-ignore
    const vertexs = geometry.coordinates[0].slice();
    for (let i = 0 ; i < vertexs.length ; i += Math.round((vertexs.length / 4))) {
      points.push(createVertex(properties.id , vertexs[i] , `0.${i}` , false));
    }
  }
  return points;
}