import { Component, AfterViewInit, computed, effect, signal, inject } from '@angular/core';
import * as L from 'leaflet';
import { SwitcherComponent } from '../switcher/switcher.component';
import { MountainStateService } from '../services/mountain-state.service';
import { MapService } from '../services/map.service';
import { HideTrackPreviewComponent } from '../hide-track-preview/hide-track-preview.component';
import { MountainDetailComponent } from '../mountain-detail/mountain-detail.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

const MAPY_CZ_URL =
  'https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=' + environment.apiKey;

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
  imports: [SwitcherComponent, HideTrackPreviewComponent, MountainDetailComponent, CommonModule],
})
export class LeafletMapComponent implements AfterViewInit {
  mapInitialized = signal(false);
  mountainName = computed(() => this.mountainStateService.mountainName());
  mountainCoordinates = computed(() => this.mountainStateService.mountainCoordinates());

  marker!: L.Circle;
  isMountainDetailVisible: boolean = false;

  private mountainStateService = inject(MountainStateService);
  private mapService = inject(MapService);

  constructor() {
    effect(() => {
      if (this.mapInitialized()) {
        this.createMarker();
        this.mapService.centerMap(this.mountainCoordinates());
      }
    });
  }

  ngAfterViewInit() {
    this.mapService.initMap('map', this.mountainCoordinates(), 17, MAPY_CZ_URL);
    this.mapInitialized.set(true);
  }

  createMarker() {
    console.log('running createMarker');
    this.marker = this.mapService.createMarker(this.mountainCoordinates());
    this.marker.on('click', () => {
      this.showMountainDetail();
    });
    this.mapService.addMarker(this.marker);
  }

  showMountainDetail() {
    this.isMountainDetailVisible = true;
  }
  hideMountainDetail() {
    this.isMountainDetailVisible = false;
  }
}
