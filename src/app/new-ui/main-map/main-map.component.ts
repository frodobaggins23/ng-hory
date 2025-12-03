import { AfterViewInit, Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MapService } from '../../services/new-ui/map.service';
import { MountainDialogComponent } from '../mountain-dialog/mountain-dialog.component';

const MAPY_CZ_URL =
  'https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=' + environment.mapApiKey;

@Component({
  selector: 'app-main-map',
  imports: [CommonModule, MountainDialogComponent],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent implements AfterViewInit {
  mapService = inject(MapService);
  showDialog: boolean = true;

  mountainDialogData = {
    mountain: { name: 'Ronov', coordinates: [50.5, 15.2], imgFolder: 'ronov' },
    subtitle: 'Liberecký kraj • 552 m n. m.',
    statistics: [
      { value: 1, label: 'výstupů', icon: '⛰️' },
      { value: 552, label: 'm n. m.' },
      { value: 2, label: 'trasy' },
    ],
  };

  async ngAfterViewInit() {
    await this.mapService.initMap('map', MAPY_CZ_URL);
  }

  handleDialogOpen() {
    this.showDialog = true;
  }

  handleDialogClose() {
    this.showDialog = false;
  }

  handleDialogAction() {
    console.log('Action button clicked');
  }
}
