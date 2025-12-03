import * as L from 'leaflet';

export class MarkerSelectionManager {
  private selectedMarker: L.Marker | null = null;
  private readonly selector = '.marker-circle';
  private readonly selectedClassName = 'selected';

  select(marker: L.Marker): void {
    this.clearSelection();

    const element = marker.getElement();
    if (element) {
      const circle = element.querySelector(this.selector);
      circle?.classList.add(this.selectedClassName);
      this.selectedMarker = marker;
    }
  }

  clearSelection(): void {
    if (this.selectedMarker) {
      const prevElement = this.selectedMarker.getElement();
      if (prevElement) {
        const prevCircle = prevElement.querySelector(this.selector);
        prevCircle?.classList.remove(this.selectedClassName);
      }
      this.selectedMarker = null;
    }
  }

  getSelected(): L.Marker | null {
    return this.selectedMarker;
  }
}
