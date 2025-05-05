import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  computed,
  effect,
} from '@angular/core';
import * as L from 'leaflet';
import geojsontest from '../assets/test-geojson.json';
import { SwitcherComponent } from '../switcher/switcher.component';
import { MountainStateService } from '../services/mountain-state.service';

const API_KEY = 'KjyC3fA7h5K85KSxtf8czTIDggXXGkUirvOF_c6Hp_E';
const MAPY_CZ_URL =
  'https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=' + API_KEY;

const HOME_GPS: L.LatLngExpression = [50.0898917, 14.6692611];

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
  imports: [SwitcherComponent],
})
export class LeafletMapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  @Input() location: string = 'foo';

  mountainName = computed(() => this.mountainStateService.mountainName());
  mountainCoordinates = computed(() =>
    this.mountainStateService.mountainCoordinates()
  );

  marker: L.Circle = this.createMarker(HOME_GPS);

  constructor(private mountainStateService: MountainStateService) {
    effect(() => {
      this.marker = this.createMarker(this.mountainCoordinates());
      if (this.map) {
        this.centerMap();
        this.marker.addTo(this.map);
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
    this.marker = this.createMarker(this.mountainCoordinates());
    this.centerMap();
    this.marker.addTo(this.map);
    //https://mygeodata.cloud/
    L.geoJSON(geojsontest as GeoJSON.GeoJsonObject).addTo(this.map);
  }

  private createMarker(coordinates: L.LatLngExpression) {
    const marker = L.circle(coordinates, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 10,
    });
    return marker;
  }

  private initMap() {
    const baseMapURl = MAPY_CZ_URL;
    this.map = L.map('map', {
      center: HOME_GPS,
      zoom: 17,
      layers: [],
    });
    L.tileLayer(baseMapURl).addTo(this.map);
  }

  private centerMap() {
    this.map.flyTo(this.mountainCoordinates());
  }
}
