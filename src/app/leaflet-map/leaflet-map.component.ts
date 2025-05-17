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
import { MapService } from '../services/map.service';

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
  mountainName = computed(() => this.mountainStateService.mountainName());
  mountainCoordinates = computed(() =>
    this.mountainStateService.mountainCoordinates()
  );

  marker!: L.Circle;

  constructor(
    private mountainStateService: MountainStateService,
    private mapService: MapService
  ) {
    effect(() => {
      this.marker = this.mapService.createMarker(this.mountainCoordinates());
      if ((this as any).mapInitialized) {
        this.mapService.centerMap(this.mountainCoordinates());
        this.mapService.addMarker(this.marker);
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.mapService.initMap('map', HOME_GPS, 17, MAPY_CZ_URL);
    this.marker = this.mapService.createMarker(this.mountainCoordinates());
    this.mapService.centerMap(this.mountainCoordinates(), true);
    this.mapService.addMarker(this.marker);
    (this as any).mapInitialized = true;
  }
}
