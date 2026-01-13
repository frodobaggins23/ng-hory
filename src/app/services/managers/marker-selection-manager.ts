import { Marker } from 'leaflet';

export class MarkerSelectionManager {
  private selectedMarker: Marker | null = null;
  private readonly selector = '.marker-circle';
  private readonly selectedClassName = 'selected';

  select(marker: Marker): void {
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

  getSelected(): Marker | null {
    return this.selectedMarker;
  }
}
