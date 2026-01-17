import { ComponentRef, inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { Map, TileLayer, LayerGroup, LatLngBounds, Control, DomUtil, Circle } from 'leaflet';
import { MountainService } from './mountain.service';
import { IconService } from './icon.service';
import { TooltipManager } from './managers/tooltip-manager';
import { MarkerSelectionManager } from './managers/marker-selection-manager';
import { MapMarkerFactory } from '../utils/map-marker-factory';
import { StatisticsService } from './statistics.service';
import { Subject, lastValueFrom } from 'rxjs';
import { MountainName } from '../../data/types';
import { MapLegendComponent } from '../components/main/map/map-legend/map-legend.component';

@Injectable({
  providedIn: 'root',
})
export class MapService implements OnDestroy {
  zoomLevel: number = 20;

  private map!: Map;
  private mountainsLayer: LayerGroup = new LayerGroup();
  private legendComponentRef: ComponentRef<MapLegendComponent> | null = null;

  private tooltipManager!: TooltipManager;
  private selectionManager = new MarkerSelectionManager();
  private markerFactory!: MapMarkerFactory;
  private selectedMountainMarkerSubject = new Subject<MountainName>();

  selectedMountainMarker$ = this.selectedMountainMarkerSubject.asObservable();

  mountainService = inject(MountainService);
  iconService = inject(IconService);
  statsService = inject(StatisticsService);

  constructor() {}

  ngOnDestroy(): void {
    this.selectedMountainMarkerSubject.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  async initMap(mapId: string, baseMapUrl: string, viewContainerRef: ViewContainerRef) {
    const bounds = this.getDefaultBounds();
    this.map = new Map(mapId, {
      layers: [new TileLayer(baseMapUrl), this.mountainsLayer],
    }).fitBounds(bounds, { padding: [20, 20] });

    this.tooltipManager = new TooltipManager(this.map);
    const mountainIcon = await this.loadMarkerIcon();

    this.markerFactory = new MapMarkerFactory(mountainIcon, {
      onMouseOver: (latlng, name, altitude) => this.tooltipManager.show(latlng, name, altitude),
      onMouseOut: () => this.tooltipManager.hide(),
      onClick: (marker, name) => {
        this.selectionManager.select(marker);
        this.selectedMountainMarkerSubject.next(name);
      },
    });
    this.createLegend(viewContainerRef);
    this.populateWithMountainMarkers();
  }

  loadMarkerIcon() {
    return lastValueFrom(this.iconService.getSvg('mountain'));
  }

  getDefaultBounds(): LatLngBounds {
    const coordinates = this.mountainService.getAllCoordinates();
    return new LatLngBounds(coordinates as Array<[number, number]>);
  }

  private createLegend(viewContainerRef: ViewContainerRef): void {
    if (!this.map) return;

    const legend = new Control({ position: 'topright' });
    const { mountainCount, climbCount } = this.statsService.getBasicStats();

    legend.onAdd = () => {
      const div = DomUtil.create('div', 'map-legend');

      this.legendComponentRef = viewContainerRef.createComponent(MapLegendComponent);
      this.legendComponentRef.setInput('mountainCount', mountainCount);
      this.legendComponentRef.setInput('climbCount', climbCount);
      div.appendChild(this.legendComponentRef.location.nativeElement);

      return div;
    };
    legend.addTo(this.map);
  }

  addMarker(marker: Circle) {
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
