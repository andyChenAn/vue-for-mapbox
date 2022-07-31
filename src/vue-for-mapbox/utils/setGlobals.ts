export default function setGlobals (mapboxgl: any , props: any) : void {
  for (let key in props) {
    if (props[key]) {
      mapboxgl[key] = props[key];
    }
  }
}