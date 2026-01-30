import { Component } from '@angular/core';

import { NavComponent } from '../nav/nav.component';
import { MainMapComponent } from './map/main-map.component';

@Component({
  selector: 'app-main',
  imports: [NavComponent, MainMapComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
