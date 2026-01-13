import { Map, DomUtil, LatLng } from 'leaflet';

export class TooltipManager {
  private tooltipDiv: HTMLDivElement | null = null;

  constructor(private map: Map) {
    this.createTooltip();
  }

  private createTooltip(): void {
    this.tooltipDiv = DomUtil.create('div', 'mountain-tooltip');
    this.tooltipDiv.style.position = 'absolute';
    this.tooltipDiv.style.display = 'none';
    this.tooltipDiv.style.pointerEvents = 'none';
    this.tooltipDiv.style.zIndex = '1000';
    this.map.getContainer().appendChild(this.tooltipDiv);
  }

  show(latlng: LatLng, mountainName: string, altitude: string): void {
    if (!this.tooltipDiv) return;

    const point = this.map.latLngToContainerPoint(latlng);
    this.tooltipDiv.innerHTML = `<p><strong>${mountainName}</strong><p/><p> ${altitude}</p>`;
    this.tooltipDiv.style.left = point.x + 25 + 'px';
    this.tooltipDiv.style.top = point.y - 25 + 'px';
    this.tooltipDiv.style.display = 'block';
  }

  hide(): void {
    if (this.tooltipDiv) {
      this.tooltipDiv.style.display = 'none';
    }
  }

  destroy(): void {
    if (this.tooltipDiv && this.tooltipDiv.parentNode) {
      this.tooltipDiv.parentNode.removeChild(this.tooltipDiv);
      this.tooltipDiv = null;
    }
  }
}
