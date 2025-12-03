import * as L from 'leaflet';
import { MapMarkerUtil } from './map-marker.util';
import { MountainName } from '../../data/types';

export interface MarkerCallbacks {
  onMouseOver: (latlng: L.LatLng, name: string, altitude: string) => void;
  onMouseOut: () => void;
  onClick: (marker: L.Marker, name: MountainName) => void;
}

export class MapMarkerFactory {
  constructor(
    private mountainIconSvg: string,
    private callbacks: MarkerCallbacks
  ) {}

  createMountainMarker(
    coordinates: L.LatLngExpression,
    name: MountainName,
    altitude: string
  ): L.Marker {
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
      this.callbacks.onMouseOver(e.latlng, name, altitude);
    });

    marker.on('mouseout', () => {
      this.callbacks.onMouseOut();
    });

    marker.on('click', () => {
      this.callbacks.onClick(marker, name);
    });

    return marker;
  }
}
