import { Feature } from "geojson";
import createVertex from '@mapbox/mapbox-gl-draw/src/lib/create_vertex';
import deepEqual from "../../utils/deepEqual";
export default function createRectVertex (geojson: Feature) {
  const { geometry , properties } = geojson;
  const points = [];
  // @ts-ignore
  const vertexs = geometry.coordinates[0].slice();
  for (let i = 0 ; i < vertexs.length ; i++) {
    if (deepEqual(properties?.user_point , vertexs[i]) || deepEqual(properties?.user_endPoint , vertexs[i])) {
      points.push(createVertex(properties?.id , vertexs[i] , `0.${i}` , false));
    }
  };
  return points.slice(0 , 2);
}