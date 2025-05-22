import {
  Component,
  OnInit,
  AfterViewInit,
  computed,
  effect,
  signal,
} from '@angular/core';
import * as L from 'leaflet';
import { SwitcherComponent } from '../switcher/switcher.component';
import { MountainStateService } from '../services/mountain-state.service';
import { MapService } from '../services/map.service';
import { HideTrackPreviewComponent } from '../hide-track-preview/hide-track-preview.component';
import { MountainDetailComponent } from '../mountain-detail/mountain-detail.component';
import { CommonModule } from '@angular/common';

const API_KEY = 'KjyC3fA7h5K85KSxtf8czTIDggXXGkUirvOF_c6Hp_E';
const MAPY_CZ_URL =
  'https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=' + API_KEY;

const HOME_GPS: L.LatLngExpression = [50.0898917, 14.6692611];

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
  imports: [
    SwitcherComponent,
    HideTrackPreviewComponent,
    MountainDetailComponent,
    CommonModule,
  ],
})
export class LeafletMapComponent implements OnInit, AfterViewInit {
  mapInitialized = signal(false);
  mountainName = computed(() => this.mountainStateService.mountainName());
  mountainCoordinates = computed(() =>
    this.mountainStateService.mountainCoordinates()
  );

  marker!: L.Circle;
  showMountainDetail: boolean = false;

  constructor(
    private mountainStateService: MountainStateService,
    private mapService: MapService
  ) {
    let firstInit = true;
    effect(() => {
      if (this.mapInitialized()) {
        this.createMarker();
        this.mapService.centerMap(this.mountainCoordinates(), firstInit);
        firstInit = false;
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.mapService.initMap('map', HOME_GPS, 17, MAPY_CZ_URL);
    this.mapInitialized.set(true);
  }

  createMarker() {
    console.log('running createMarker');
    this.marker = this.mapService.createMarker(this.mountainCoordinates());
    this.marker.on('click', () => {
      this.toggleMountainDetail();
    });
    this.mapService.addMarker(this.marker);
  }
  toggleMountainDetail() {
    this.showMountainDetail = !this.showMountainDetail;
  }
}
