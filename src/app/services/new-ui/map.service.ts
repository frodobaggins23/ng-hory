import { inject, Injectable } from '@angular/core';
import * as L from 'leaflet';
import { MountainService } from './mountain.service';
import { IconService } from '../../icon.service';
import { MapLegendUtil } from '../../utils/map-legend.util';
import { TooltipManager } from './managers/tooltip-manager';
import { MarkerSelectionManager } from './managers/marker-selection-manager';
import { IconLoader } from './managers/icon-loader';
import { MapMarkerFactory } from '../../utils/map-marker-factory';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  zoomLevel: number = 20;

  private map!: L.Map;
  private mountainsLayer: L.LayerGroup = L.layerGroup();

  private tooltipManager!: TooltipManager;
  private selectionManager = new MarkerSelectionManager();
  private iconLoader: IconLoader;
  private markerFactory!: MapMarkerFactory;

  mountainService = inject(MountainService);
  iconService = inject(IconService);

  constructor() {
    this.iconLoader = new IconLoader(this.iconService);
  }

  async initMap(mapId: string, baseMapUrl: string) {
    const bounds = this.getDefaultBounds();
    this.map = L.map(mapId, {
      layers: [L.tileLayer(baseMapUrl), this.mountainsLayer],
    }).fitBounds(bounds, { padding: [20, 20] });

    const icons = await this.iconLoader.load();

    this.tooltipManager = new TooltipManager(this.map);
    this.markerFactory = new MapMarkerFactory(icons.mountain, {
      onMouseOver: (latlng, name) => this.tooltipManager.show(latlng, name),
      onMouseOut: () => this.tooltipManager.hide(),
      onClick: marker => this.selectionManager.select(marker),
    });

    this.createLegend(icons.trendingUp);
    this.populateWithMountainMarkers();
  }

  getDefaultBounds(): L.LatLngBounds {
    const coordinates = this.mountainService.getAllCoordinates();
    return L.latLngBounds(coordinates as L.LatLngExpression[]);
  }

  private createLegend(trendingUpIconSvg: string): void {
    const legend = new L.Control({ position: 'topright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = new MapLegendUtil(trendingUpIconSvg).getHtml();
      return div;
    };
    legend.addTo(this.map);
  }

  addMarker(marker: L.Circle) {
    marker.addTo(this.map);
  }

  async populateWithMountainMarkers() {
    const mountainPoints = this.mountainService.getAllMountainPoints();
    mountainPoints.forEach(({ name, coordinates }) => {
      const marker = this.markerFactory.createMountainMarker(coordinates, name);
      marker.addTo(this.mountainsLayer);
    });
  }
}
