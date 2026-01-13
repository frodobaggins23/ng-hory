import { Marker, DivIcon, LatLng, LatLngExpression } from 'leaflet';
import { MapMarkerUtil } from './map-marker.util';
import { MountainName } from '../../data/types';

export interface MarkerCallbacks {
  onMouseOver: (latlng: LatLng, name: string, altitude: string) => void;
  onMouseOut: () => void;
  onClick: (marker: Marker, name: MountainName) => void;
}

export class MapMarkerFactory {
  constructor(
    private mountainIconSvg: string,
    private callbacks: MarkerCallbacks
  ) {}

  createMountainMarker(
    coordinates: LatLngExpression,
    name: MountainName,
    altitude: string
  ): Marker {
    const styledIconHtml = new MapMarkerUtil(this.mountainIconSvg).getStyledIcon();
    const icon = new DivIcon({
      className: 'custom-mountain-marker',
      html: styledIconHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });

    const marker = new Marker(coordinates, { icon });

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
