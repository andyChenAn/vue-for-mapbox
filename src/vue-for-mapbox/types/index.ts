import { LngLatLike, PaddingOptions } from 'mapbox-gl';
export type {
  Map as MapboxMap,
  LngLatLike,
  LngLat,
  LngLatBounds,
  LngLatBoundsLike,
  Point,
  PointLike,
  Light,
  Fog,
  TerrainSpecification,
  GeoJSONSource,
  GeoJSONSourceRaw,
  AnySourceImpl,
  ImageSource,
  VideoSource,
  VectorSource,
  MapLayerMouseEvent,
  MapboxEvent,
  MapBoxZoomEvent,
  MapDataEvent,
  MapStyleDataEvent,
  MapSourceDataEvent,
  MapWheelEvent,
  ErrorEvent,
  MapMouseEvent
} from 'mapbox-gl';
// 相机属性
export type CameraAttribute = {
  center: LngLatLike;
  zoom: number;
  bearing: number;
  pitch: number;
  padding: PaddingOptions
}
// mapbox全局配置
export type GlobalSettings = {
  baseApiUrl?: string;
  workerCount?: number;
  maxParallelImageRequests?: number;
};