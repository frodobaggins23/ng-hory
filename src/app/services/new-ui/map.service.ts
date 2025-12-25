import { inject, Injectable, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { MountainService } from './mountain.service';
import { IconService } from '../../icon.service';
import { MapLegendUtil } from '../../utils/map-legend.util';
import { TooltipManager } from './managers/tooltip-manager';
import { MarkerSelectionManager } from './managers/marker-selection-manager';
import { IconLoader } from './managers/icon-loader';
import { MapMarkerFactory } from '../../utils/map-marker-factory';
import { StatisticsService } from './statistics.service';
import { Subject } from 'rxjs';
import { MountainName } from '../../../data/types';

@Injectable({
  providedIn: 'root',
})
export class MapService implements OnDestroy {
  zoomLevel: number = 20;

  private map!: L.Map;
  private mountainsLayer: L.LayerGroup = L.layerGroup();

  private tooltipManager!: TooltipManager;
  private selectionManager = new MarkerSelectionManager();
  private iconLoader: IconLoader;
  private markerFactory!: MapMarkerFactory;
  private selectedMountainMarkerSubject = new Subject<MountainName>();

  selectedMountainMarker$ = this.selectedMountainMarkerSubject.asObservable();

  mountainService = inject(MountainService);
  iconService = inject(IconService);
  statsService = inject(StatisticsService);

  constructor() {
    this.iconLoader = new IconLoader(this.iconService);
  }

  ngOnDestroy(): void {
    this.selectedMountainMarkerSubject.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  async initMap(mapId: string, baseMapUrl: string) {
    const bounds = this.getDefaultBounds();
    this.map = L.map(mapId, {
      layers: [L.tileLayer(baseMapUrl), this.mountainsLayer],
    }).fitBounds(bounds, { padding: [20, 20] });

    const icons = await this.iconLoader.load();

    this.tooltipManager = new TooltipManager(this.map);
    this.markerFactory = new MapMarkerFactory(icons.mountain, {
      onMouseOver: (latlng, name, altitude) => this.tooltipManager.show(latlng, name, altitude),
      onMouseOut: () => this.tooltipManager.hide(),
      onClick: (marker, name) => {
        this.selectionManager.select(marker);
        this.selectedMountainMarkerSubject.next(name);
      },
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
    const { mountainCount, climbCount } = this.statsService.getBasicStats();

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = new MapLegendUtil({
        icon: trendingUpIconSvg,
        mountainCount,
        climbCount,
      }).getHtml();
      return div;
    };
    legend.addTo(this.map);
  }

  addMarker(marker: L.Circle) {
    marker.addTo(this.map);
  }

  async populateWithMountainMarkers() {
    const mountainPoints = this.mountainService.getAllMountainPoints();
    mountainPoints.forEach(({ name, coordinates, altitude }) => {
      const marker = this.markerFactory.createMountainMarker(
        coordinates,
        name,
        `${altitude} m.n.m`
      );
      marker.addTo(this.mountainsLayer);
    });
  }
}
