import type { 
  MapboxMap , 
  LngLatBoundsLike , 
  Light , 
  Fog , 
  TerrainSpecification , 
  CameraAttribute , 
  MapboxEvent , 
  MapLayerMouseEvent , 
  MapBoxZoomEvent,
  MapStyleDataEvent,
  MapSourceDataEvent,
  ErrorEvent,
  MapWheelEvent,
  MapMouseEvent
} from '../types';
import deepEqual from '../utils/deepEqual';
import Draw from '../draw';
type MapboxProps = {
  accessToken?: string;
  cursor?: string;
  mapStyle?: string;
  minZoom?: number;
  maxZoom?: number;
  hash?: boolean;
  light?: Light;
  fog?: Fog | null;
  styleDiff?: boolean;
  renderWorldCopies?: boolean;
  terrain?: TerrainSpecification | null;
  interactive?: boolean;
  bearingSnap?: number;
  interactiveLayerIds?: string[];
  pitchWithRotate?: boolean;
  clickTolerance?: number;
  attributionControl?: boolean;
  customAttribution?: string | string[];
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  failIfMajorPerformanceCaveat?: boolean;
  preserveDrawingBuffer?: boolean;
  antialias?: boolean;
  refreshExpiredTiles?: boolean;
  maxBounds?: LngLatBoundsLike;
  scrollZoom?: boolean;
  boxZoom?: boolean;
  dragRotate?: boolean;
  dragPan?: boolean;
  keyboard?: boolean;
  doubleClickZoom?: boolean;
  touchZoomRotate?: boolean;
  trackResize?: boolean;
  
  baseApiUrl?: string;
  workerCount?: number;
  maxParallelImageRequests?: number;
  reuseMap?: boolean;
  // 相机属性
  cameraAttribute?: Partial<CameraAttribute>;
  onClick?: (evt: MapLayerMouseEvent) => void;
  onMouseDown?: (evt: MapLayerMouseEvent) => void;
  onMouseUp?: (evt: MapLayerMouseEvent) => void;
  onDblClick?: (evt: MapLayerMouseEvent) => void;
  onMouseMove?: (evt: MapLayerMouseEvent) => void;
  onMouseEnter?: (evt: MapLayerMouseEvent) => void;
  onMouseLeave?: (evt: MapLayerMouseEvent) => void;
  onMouseOver?: (evt: MapLayerMouseEvent) => void;
  onMouseOut?: (evt: MapLayerMouseEvent) => void;
  onContextMenu?: (evt: MapLayerMouseEvent) => void;

  onMoveStart?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onMove?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onMoveEnd?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onDragStart?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onDrag?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onDragEnd?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onZoomStart?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onZoom?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onZoomEnd?: (evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>) => void;
  onRotateStart?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onRotate?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onRotateEnd?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onPitchStart?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onPitch?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;
  onPitchEnd?: (evt: MapboxEvent<MouseEvent | TouchEvent | undefined>) => void;

  onWheel?: (evt: MapWheelEvent) => void;
  onBoxZoomStart?: (evt: MapBoxZoomEvent) => void;
  onBoxZoomCancel?: (evt: MapBoxZoomEvent) => void;
  onBoxZoomEnd?: (evt: MapBoxZoomEvent) => void;
  onResize?: (evt: MapboxEvent) => void;
  onLoad?: (evt: MapboxEvent) => void;
  onIdle?: (evt: MapboxEvent) => void;
  onRemove?: (evt: MapboxEvent) => void;
  onRender?: (evt: MapboxEvent) => void;
  onStyleData?: (evt: MapStyleDataEvent) => void;
  onSourceData?: (evt: MapSourceDataEvent) => void;
  onError?: (evt: ErrorEvent) => void;
  onDataLoading?: (evt: MapSourceDataEvent) => void;
  onStyleDataLoading?: (evt: MapStyleDataEvent) => void;
  onSourceDataLoading?: (evt: MapSourceDataEvent) => void;
  onStyleImageMissing?: (evt: any) => void;
  [key: string]: any;
}

// 鼠标事件
const mouseEvents = {
  mousedown : 'onMouseDown',
  mouseup : 'onMouseUp',
  click : 'onClick',
  dblclick : 'onDblClick',
  mousemove : 'onMouseMove',
  mouseenter : 'onMouseEnter',
  mouseleave : 'onMouseLeave',
  mouseover : 'onMouseOver',
  mouseout : 'onMouseOut',
  contextmenu : 'onContextMenu'
};

// 相机事件
const cameraEvents = {
  movestart : 'onMoveStart',
  move : 'onMove',
  moveend : 'onMoveEnd',
  dragstart : 'onDragStart',
  drag : 'onDrag',
  dragend : 'onDragEnd',
  zoomstart : 'onZoomStart',
  zoom : 'onZoom',
  zoomend : 'onZoomEnd',
  rotatestart : 'onRotateStart',
  rotate : 'onRotate',
  rotateend : 'onRotateEnd',
  pitchstart : 'onPitchStart',
  pitch : 'onPitch',
  pitchend : 'onPitchEnd'
};

// 地图事件
const mapEvents = {
  wheel : 'onWheel',
  boxzoomstart : 'onBoxZoomStart',
  boxzoomcancel : 'onBoxZoomCancel',
  boxzoomend : 'onBoxZoomEnd',
  resize : 'onResize',
  load : 'onLoad',
  idle : 'onIdle',
  remove : 'onRemove',
  render : 'onRender',
  styledata : 'onStyleData',
  sourcedata : 'onSourceData',
  error : 'onError',
  dataloading : 'onDataLoading',
  styledataloading : 'onStyleDataLoading',
  sourcedataloading : 'onSourceDataLoading',
  styleimagemissing : 'onStyleImageMissing'
}


const cameraOptions: (keyof CameraAttribute)[] = ['zoom','pitch','bearing','padding' , 'center'];
const mapSettings: (keyof MapboxProps)[] = ['minZoom' , 'maxZoom' , 'minPitch' , 'maxBounds' , 'renderWorldCopies']
export default class Mapbox {
  private _MapClass: typeof MapboxMap;
  private _map: any = null;
  props: MapboxProps;
  sourceCount: number = 0;
  layerCount: number = 0;
  draw: any;
  static mapList: Mapbox[] = [];
  constructor (Mapclass: typeof MapboxMap , props: MapboxProps , container: HTMLDivElement) {
    this.props = props;
    this._MapClass = Mapclass;
    this.init(container);
  }
  init (container: HTMLDivElement) {
    const { props } = this;
    // 初始化参数
    const mapOptions = {
      ...props,
      ...props.cameraAttribute,
      container,
      style : props.mapStyle
    }
    // 创建mapbox实例
    const map: any = new this._MapClass(mapOptions);
    if (props.cursor) {
      map.getCanvas().style.cursor = props.cursor;
    }
    // 创建draw实例
    this.draw = new Draw(map);
    this._map = map;
    this.startAnimationRequest(props);
    // 绑定事件
    // 绑定事件
    for (let eventName in mouseEvents) {
      map.on(eventName , this.wrapperMouseEvents.bind(this))
    }
    for (let eventName in cameraEvents) {
      map.on(eventName , this.wrappercameraEvents.bind(this))
    };
    for (let eventName in mapEvents) {
      map.on(eventName , this.wrapperMapEvents.bind(this))
    }
  }
  wrapperHoverEvents (evt: MapMouseEvent) {
    const flag = this.props.interactiveLayerIds && (this.props.onMouseEnter || this.props.onMouseLeave || this.props.onMouseOver);
    if (flag) {
      const eventType = evt.type;
      let features;
      if (eventType === 'mousemove') {
        features = this._map.queryRenderedFeatures(evt.point , {
          layers : this.props.interactiveLayerIds
        });
      } else {
        features = [];
      }
      const isHoverInLayer = features.length > 0;
      if (!isHoverInLayer) {
        // 离开图层
        evt.type = 'mouseleave';
        this.wrapperMouseEvents(evt);
      } else {
        // 进入图层
        evt.type = 'mouseenter';
        this.wrapperMouseEvents(evt);
      }
      evt.type = eventType;
    }
  }
  wrapperMouseEvents (evt: MapLayerMouseEvent) {
    const map = this.map;
    if (evt.type === 'mousemove' || evt.type === 'mouseout') {
      this.wrapperHoverEvents(evt);
    }
    const handler = this.props[mouseEvents[evt.type]];
    if (handler) {
      if (this.props.interactiveLayerIds) {
        const features = map.queryRenderedFeatures(evt.point , {
          layers : this.props.interactiveLayerIds
        });
        evt.features = features;
      }
      handler(evt);
      delete evt.features;
    }
  }
  wrappercameraEvents (evt: any) {
    const handler = this.props[(cameraEvents as any)[evt.type]];
    if (handler) {
      handler(evt);
    }
  }
  wrapperMapEvents (evt: MapboxEvent) {
    const handler = this.props[(mapEvents as any)[evt.type]];
    if (handler) {
      handler(evt);
    }
  }
  startAnimationRequest (props: MapboxProps) {
    const map = this._map;
    let requestId: any;
    const update = () => {
      if (map.isStyleLoaded()) {
        cancelAnimationFrame(requestId);
        this.updateFog(props , {});
        this.updateLight(props , {});
        this.updateTerrain(props , {});
        return;
      }
      requestId = requestAnimationFrame(update);
    }
    update();
  }
  get map (): MapboxMap {
    return this._map;
  }
  static reuse (container: HTMLDivElement , props: MapboxProps) {
    const instance = Mapbox.mapList.pop();
    if (!instance) {
      return null;
    }
    const map = instance.map;
    const oldContainer = map.getContainer();
    container.className = oldContainer.className;
    while (oldContainer.childNodes.length > 0) {
      container.appendChild(oldContainer.childNodes[0]);
    }
    // @ts-ignore
    map._container = container;
    instance.updateProps({...props});
    return instance;
  }
  updateProps (props: MapboxProps) {
    const prevProps = this.props;
    this.props = props;
    //console.log(props.cameraAttribute?.bearing , prevProps.cameraAttribute?.bearing)
    // 更新相机属性，pitch，zoom，bearing,padding,center
    this.udpateCameraOptions(props.cameraAttribute as CameraAttribute);
    // 更新mapbox配置数据
    this.updateMapSettings(props , prevProps);
    // 更新地图样式
    this.updateMapStyle(props , prevProps);
    // 更新fog，light，terrain
    this.updateLight(props , prevProps);
    this.updateFog(props , prevProps);
    this.updateTerrain(props , prevProps);
  }
  updateTerrain (props: MapboxProps , prevProps: MapboxProps) {
    const map = this._map;
    if (map.isStyleLoaded()) {
      if ('terrain' in props && !deepEqual(props.terrain , prevProps.terrain)) {
        const source = map.getSource(props.terrain?.source);
        if (source) {
          map.setTerrain(props.terrain);
        } else {
          // 如果还没有获取到source，那么就先等待加载source之后再设置
          let requestId: any;
          const wait = () => {
            const source = map.getSource(props.terrain?.source);
            if (source) {
              cancelAnimationFrame(requestId);
              map.setTerrain(props.terrain);
              return;
            }
            requestId = window.requestAnimationFrame(wait);
          };
          wait();
        }
      }
    }
  }
  updateLight (props: MapboxProps , prevProps: MapboxProps) {
    const map = this._map;
    if (map.isStyleLoaded()) {
      if ('light' in props && !deepEqual(props.light , prevProps.light)) {
        map.setLight(props.light);
      }
    }
  }
  updateFog (props: MapboxProps , prevProps: MapboxProps) {
    const map = this._map;
    if (map.isStyleLoaded()) {
      if ('fog' in props && !deepEqual(props.fog , prevProps.fog)) {
        map.setFog(props.fog);
      }
    }
  }
  updateMapStyle (props: MapboxProps , prevProps: MapboxProps) {
    const map = this._map;
    if (props.cursor !== prevProps.cursor) {
      map.getCanvas().style.cursor = props.cursor;
    };
    if (props.mapStyle !== prevProps.mapStyle) {
      const options: any = {
        diff : props.styleDiff
      };
      if ('localIdeographFontFamily' in props && props['localIdeographFontFamily']) {
        options.localIdeographFontFamily = props['localIdeographFontFamily'];
      };
      map.setStyle(props.mapStyle , options);
    }
  }
  updateMapSettings (props: MapboxProps , prevProps: MapboxProps) {
    const map = this._map;
    for (const key in mapSettings) {
      if (key in props && !deepEqual(props[key] , prevProps[key])) {
        map[`set${key[0].toUpperCase()}${key.slice(1)}`](props[key]);
      }
    }
  }
  destroy () {
    this._map.remove();
  }
  recycle () {
    Mapbox.mapList.push(this);
  }
  udpateCameraOptions (props: CameraAttribute) {
    const map = this._map;
    for (const key of cameraOptions) {
      if (key in props) {
        map[`set${key[0].toUpperCase()}${key.slice(1)}`](props[key]);
      }
    }
  }
}