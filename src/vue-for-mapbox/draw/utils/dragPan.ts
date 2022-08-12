export function disable (customDraw: MapboxDraw.DrawCustomModeThis) {
  if ((customDraw as any).map) {
    (customDraw as any).map.dragPan.disable();
  }
};
export function enable (customDraw: MapboxDraw.DrawCustomModeThis) {
  if ((customDraw as any).map) {
    (customDraw as any).map.dragPan.enable();
  }
}