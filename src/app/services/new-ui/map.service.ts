import { inject, Injectable } from '@angular/core';
import * as L from 'leaflet';
import { forkJoin } from 'rxjs';
import { MountainService } from './mountain.service';
import { IconService } from '../../icon.service';
import { MapMarkerUtil } from '../../utils/map-marker.util';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  zoomLevel: number = 20;

  private map!: L.Map;
  private mountainIconSvg: string = '';
  private trendingUpIconSvg: string = '';
  private iconsLoaded = false;

  mountainService = inject(MountainService);
  iconService = inject(IconService);

  constructor() {}

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

  async initMap(mapId: string, baseMapUrl: string) {
    const bounds = this.getDefaultBounds();
    this.map = L.map(mapId, { layers: [] }).fitBounds(bounds, { padding: [20, 20] });
    L.tileLayer(baseMapUrl).addTo(this.map);
    await this.loadIcons();
  }

  getDefaultBounds(): L.LatLngBounds {
    const coordinates = this.mountainService.getAllMountainPoints();
    return L.latLngBounds(coordinates as L.LatLngExpression[]);
  }

  createMountainMarker(coordinates: L.LatLngExpression): L.Marker {
    const styledIconHtml = new MapMarkerUtil(this.mountainIconSvg).getStyledIcon();
    const icon = L.divIcon({
      className: 'custom-mountain-marker',
      html: styledIconHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });

    return L.marker(coordinates, { icon });
  }

  addMarker(marker: L.Circle) {
    marker.addTo(this.map);
  }

  async populateWithMountainMarkers() {
    const mountainPoints = this.mountainService.getAllMountainPoints();
    mountainPoints.forEach(point => {
      const marker = this.createMountainMarker(point);
      marker.addTo(this.map);
    });
  }
}
