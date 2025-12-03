import { inject, Injectable } from '@angular/core';
import * as L from 'leaflet';
import { forkJoin } from 'rxjs';
import { MountainService } from './mountain.service';
import { IconService } from '../../icon.service';
import { MapMarkerUtil } from '../../utils/map-marker.util';
import { MapLegendUtil } from '../../utils/map-legend.util';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  zoomLevel: number = 20;

  private map!: L.Map;
  private mountainIconSvg: string = '';
  private trendingUpIconSvg: string = '';
  private iconsLoaded = false;
  private selectedMarker: L.Marker | null = null;
  private tooltipDiv: HTMLDivElement | null = null;

  mountainService = inject(MountainService);
  iconService = inject(IconService);

  constructor() {}

  async initMap(mapId: string, baseMapUrl: string) {
    const bounds = this.getDefaultBounds();
    this.map = L.map(mapId, { layers: [] }).fitBounds(bounds, { padding: [20, 20] });

    L.tileLayer(baseMapUrl).addTo(this.map);
    await this.loadIcons();
    this.createLegend().addTo(this.map);
    this.createTooltip();
  }

  private loadIcons(): Promise<void> {
    if (this.iconsLoaded) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      forkJoin({
        mountain: this.iconService.getSvg('mountain'),
        trendingUp: this.iconService.getSvg('trending-up'),
      }).subscribe(icons => {
        this.mountainIconSvg = icons.mountain;
        this.trendingUpIconSvg = icons.trendingUp;
        this.iconsLoaded = true;
        resolve();
      });
    });
  }

  getDefaultBounds(): L.LatLngBounds {
    const coordinates = this.mountainService.getAllCoordinates();
    return L.latLngBounds(coordinates as L.LatLngExpression[]);
  }

  private createTooltip(): void {
    this.tooltipDiv = L.DomUtil.create('div', 'mountain-tooltip');
    this.tooltipDiv.style.position = 'absolute';
    this.tooltipDiv.style.display = 'none';
    this.tooltipDiv.style.pointerEvents = 'none';
    this.tooltipDiv.style.zIndex = '1000';
    this.map.getContainer().appendChild(this.tooltipDiv);
  }

  private showTooltip(latlng: L.LatLng, text: string): void {
    if (!this.tooltipDiv) return;

    const point = this.map.latLngToContainerPoint(latlng);
    this.tooltipDiv.innerHTML = text;
    this.tooltipDiv.style.left = point.x + 10 + 'px';
    this.tooltipDiv.style.top = point.y - 30 + 'px';
    this.tooltipDiv.style.display = 'block';
  }

  private hideTooltip(): void {
    if (this.tooltipDiv) {
      this.tooltipDiv.style.display = 'none';
    }
  }

  createMountainMarker(coordinates: L.LatLngExpression, name: string): L.Marker {
    const styledIconHtml = new MapMarkerUtil(this.mountainIconSvg).getStyledIcon();
    const icon = L.divIcon({
      className: 'custom-mountain-marker',
      html: styledIconHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });

    const marker = L.marker(coordinates, { icon });

    marker.on('mouseover', e => {
      this.showTooltip(e.latlng, name);
    });

    marker.on('mouseout', () => {
      this.hideTooltip();
    });

    marker.on('click', () => {
      this.selectMarker(marker);
    });

    return marker;
  }

  private selectMarker(marker: L.Marker): void {
    const selector = '.marker-circle';
    const className = 'selected';
    if (this.selectedMarker) {
      const prevElement = this.selectedMarker.getElement();
      if (prevElement) {
        const prevCircle = prevElement.querySelector(selector);
        prevCircle?.classList.remove(className);
      }
    }

    const element = marker.getElement();
    if (element) {
      const circle = element.querySelector(selector);
      circle?.classList.add(className);
      this.selectedMarker = marker;
    }
  }

  private createLegend(): L.Control {
    const legend = new L.Control({ position: 'topright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = new MapLegendUtil(this.trendingUpIconSvg).getHtml();
      return div;
    };
    return legend;
  }

  addMarker(marker: L.Circle) {
    marker.addTo(this.map);
  }

  async populateWithMountainMarkers() {
    const mountainPoints = this.mountainService.getAllMountainPoints();
    mountainPoints.forEach(({ name, coordinates }) => {
      const marker = this.createMountainMarker(coordinates, name);
      marker.addTo(this.map);
    });
  }
}
