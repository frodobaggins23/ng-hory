import { Injectable, signal } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;
  isShowingTrackOnMap = signal(false);
  track: L.GeoJSON | null = null;
  zoomLevel: number = 20;
  constructor() {}

  initMap(mapId: string, center: L.LatLngExpression, zoom: number, baseMapUrl: string) {
    this.map = L.map(mapId, { center, zoom, layers: [] });
    this.zoomLevel = zoom;
    L.tileLayer(baseMapUrl).addTo(this.map);
  }

  createMarker(coordinates: L.LatLngExpression): L.Circle {
    return L.circle(coordinates, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 10,
    });
  }

  addMarker(marker: L.Circle) {
    marker.addTo(this.map);
  }

  centerMap(coordinates: L.LatLngExpression, animate: boolean = false) {
    if (animate) {
      this.map.flyTo(coordinates);
    } else {
      this.map.setView(coordinates, this.zoomLevel, { animate: false });
    }
  }

  toggleMapToGrayscale(isGrayscale: boolean) {
    const action = isGrayscale ? 'add' : 'remove';
    document.querySelector('#map')?.classList[action]('grayscale');
  }

  private animateLayerOpacity(
    _feature: GeoJSON.Feature,
    layer: L.Layer,
    initialOpacity: number,
    speed: number
  ) {
    layer.on('add', () => {
      let current = initialOpacity;
      const target = 1;
      const step = 0.05;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        (layer as L.Path).setStyle({ opacity: current });
      }, speed);
    });
  }

  showTrack(geoData: GeoJSON.GeoJsonObject, fitBounds: boolean = true) {
    this.track = L.geoJSON(geoData, {
      style: {
        opacity: 0,
        color: '#0d691e', // $primary-heavy
      },
      onEachFeature: (feature: GeoJSON.Feature, layer: L.Layer) => {
        this.animateLayerOpacity(feature, layer, 0, 100);
      },
    }).addTo(this.map);
    this.isShowingTrackOnMap.set(true);
    this.toggleMapToGrayscale(true);
    if (fitBounds) {
      this.map.fitBounds(this.track.getBounds());
    }
  }

  hideTrack() {
    if (this.track) {
      this.map.removeLayer(this.track);
      this.track = null;
      this.isShowingTrackOnMap.set(false);
      this.toggleMapToGrayscale(false);
    }
  }
}
