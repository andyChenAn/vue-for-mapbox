import { MapboxMap } from "../types";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import CircleMode from './modes/circleMode';
import SimpleSelectMode from "./modes/simpleSelectMode";
import DirectMode from "./modes/directMode";
import RectMode from './modes/rectMode';
import { GeoJSON } from "../types";
export default class Draw {
  private _map: MapboxMap;
  draw: MapboxDraw | null = null;
  constructor(map: MapboxMap) {
    this._map = map;
    this.createDrawMode();
  }
  get map() {
    return this._map;
  }
  createDrawMode() {
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: 'simple_select',
      userProperties: true,
      modes: {
        ...MapboxDraw.modes,
        draw_circle: CircleMode,
        simple_select: SimpleSelectMode,
        direct_select: DirectMode,
        draw_rect: RectMode
      },
      styles: [
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': '#000',
            'fill-opacity': 0.2
          }
        },
        {
          id: 'gl-draw-polygon-fill-inactive',
          type: 'fill',
          filter: ['all',
            ['==', 'active', 'false'],
            ['==', '$type', 'Polygon'],
            ['!=', 'mode', 'static']
          ],
          paint: {
            'fill-color': '#3bb2d0',
            'fill-opacity': 0.2
          }
        },
        {
          'id': 'gl-draw-polygon-stroke-inactive',
          'type': 'line',
          'filter': ['all',
            ['==', 'active', 'false'],
            ['==', '$type', 'Polygon'],
            ['!=', 'mode', 'static']
          ],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#000',
            'line-width': 2
          }
        },
        {
          'id': 'gl-draw-polygon-stroke-active',
          'type': 'line',
          'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#007aff',
            'line-dasharray': [0.2, 2],
            'line-width': 2
          }
        },
        {
          'id': 'gl-draw-polygon-and-line-vertex-active',
          'type': 'circle',
          'filter': ['all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static']
          ],
          'paint': {
            'circle-radius': 3,
            'circle-color': '#000'
          }
        },
      ]
    });
    this._map.addControl(this.draw);
  }
  drawCircle() {
    // @ts-ignore
    this.draw?.changeMode('draw_circle');
  }
  drawRect() {
    // @ts-ignore
    this.draw?.changeMode('draw_rect');
  }
  /**
   * 删除指定的feature
   * @param {string[]} ids feature ids
   */
  deleteDrawByIds(ids: string[]) {
    this.draw?.delete(ids);
  }
  // 删除所有feature
  deleteAll() {
    this.draw?.deleteAll();
  }
  // 获取已选择的feature
  getSelectedDraw() {
    return this.draw?.getSelected();
  }
  getSelectedDrawIds() {
    return this.draw?.getSelectedIds();
  }
  // 添加feature
  add(geojson: GeoJSON) {
    this.draw?.add(geojson);
  }
  // 获取指定的feature
  getFeatureById(featureId: string) {
    this.draw?.get(featureId);
  }
  // 获取所有的feature
  getAllFeatures() {
    return this.draw?.getAll();
  }
}