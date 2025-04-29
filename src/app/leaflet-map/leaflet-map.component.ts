import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

const API_KEY = 'KjyC3fA7h5K85KSxtf8czTIDggXXGkUirvOF_c6Hp_E';
const MAPY_CZ_URL =
  'https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=' + API_KEY;

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
})
export class LeafletMapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  markers: L.Marker[] = [
    L.marker([50.737222, 14.985278]), // Jested
  ];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
    this.centerMap();
  }

  private initMap() {
    const baseMapURl = MAPY_CZ_URL;
    this.map = L.map('map');
    L.tileLayer(baseMapURl).addTo(this.map);
  }

  private centerMap() {
    // Create a boundary based on the markers
    const bounds = L.latLngBounds(
      this.markers.map((marker) => marker.getLatLng())
    );

    // Fit the map into the boundary
    this.map.fitBounds(bounds);
  }
}
