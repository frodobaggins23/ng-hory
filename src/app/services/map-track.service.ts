import { Injectable, OnDestroy, ViewContainerRef, ComponentRef } from '@angular/core';
import { Map, GeoJSON, Control, CircleMarker, TileLayer, DomUtil, Polyline, LatLng } from 'leaflet';
import { TrackMapLegendComponent } from '../components/detail-page/track-map/track-map-legend/track-map-legend.component';

@Injectable()
export class MapTrackService implements OnDestroy {
  private map: Map | null = null;
  private track: GeoJSON | null = null;
  private legendComponentRef: ComponentRef<TrackMapLegendComponent> | null = null;

  ngOnDestroy(): void {
    this.destroyMap();
    this.destroyLegend();
  }

  initMap(container: HTMLElement, baseMapUrl: string): Map {
    this.map = new Map(container, {
      layers: [new TileLayer(baseMapUrl)],
      zoomControl: true,
      attributionControl: false,
    });

    return this.map;
  }

  private getLapColor(lapIndex?: number): string {
    if (lapIndex === undefined) return 'var(--color-orange-500)'; // default color

    const colors = ['var(--color-orange-500)', 'var(--color-amber-600)', 'var(--color-rose-500)'];

    return colors[(lapIndex - 1) % colors.length];
  }

  showTrack(geoData: GeoJSON.GeoJsonObject, viewContainerRef?: ViewContainerRef): void {
    if (!this.map) {
      console.warn('MapTrackService: Map not initialized');
      return;
    }

    this.track = new GeoJSON(geoData, {
      style: feature => ({
        opacity: 1,
        color: this.getLapColor(feature?.properties?.lapIndex),
        weight: 3,
      }),
    }).addTo(this.map);

    // Fit map to track bounds
    this.map.fitBounds(this.track.getBounds(), { padding: [20, 20] });

    // Add start and end markers
    this.addStartEndMarkers();

    // Add legend
    if (viewContainerRef) {
      this.createLegend(viewContainerRef);
    }
  }

  private createLegend(viewContainerRef: ViewContainerRef): void {
    if (!this.map) return;

    this.destroyLegend();

    const legend = new Control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = DomUtil.create('div', 'track-map-legend-container');

      this.legendComponentRef = viewContainerRef.createComponent(TrackMapLegendComponent);
      div.appendChild(this.legendComponentRef.location.nativeElement);

      return div;
    };

    legend.addTo(this.map);
  }

  private destroyLegend(): void {
    if (this.legendComponentRef) {
      this.legendComponentRef.destroy();
      this.legendComponentRef = null;
    }
  }

  private addStartEndMarkers(): void {
    if (!this.map || !this.track) return;

    const layers = this.track.getLayers();
    const polylines = layers.filter(l => l instanceof Polyline) as Polyline[];

    if (polylines.length === 0) return;

    // Helper to get first/last LatLng from potentially nested arrays (MultiLineString)
    type LatLngNested = LatLng | LatLngNested[];

    const getFirstPoint = (coords: LatLngNested): LatLng =>
      Array.isArray(coords) ? getFirstPoint(coords[0]) : coords;

    const getLastPoint = (coords: LatLngNested): LatLng =>
      Array.isArray(coords) ? getLastPoint(coords[coords.length - 1]) : coords;

    const firstPolyline = polylines[0];
    const lastPolyline = polylines[polylines.length - 1];

    const startLatLng = getFirstPoint(firstPolyline.getLatLngs() as LatLngNested);
    const endLatLng = getLastPoint(lastPolyline.getLatLngs() as LatLngNested);

    // Start marker (green)
    new CircleMarker(startLatLng, {
      radius: 6,
      fillColor: 'var(--color-green-500)',
      color: 'var(--color-white)',
      weight: 2,
      fillOpacity: 1,
    }).addTo(this.map);

    // End marker (red)
    new CircleMarker(endLatLng, {
      radius: 6,
      fillColor: 'var(--color-red-500)',
      color: 'var(--color-white)',
      weight: 2,
      fillOpacity: 1,
    }).addTo(this.map);
  }

  destroyMap(): void {
    if (this.track && this.map) {
      this.map.removeLayer(this.track);
      this.track = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
