import { AfterViewInit, Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MapService } from '../../services/new-ui/map.service';

const MAPY_CZ_URL =
  'https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=' + environment.mapApiKey;

@Component({
  selector: 'app-main-map',
  imports: [CommonModule],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent implements AfterViewInit {
  mapService = inject(MapService);

  async ngAfterViewInit() {
    await this.mapService.initMap('map', MAPY_CZ_URL);
    this.mapService.populateWithMountainMarkers();
  }
}
