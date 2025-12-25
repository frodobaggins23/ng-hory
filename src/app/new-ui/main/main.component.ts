import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { MainMapComponent } from './map/main-map.component';

@Component({
  selector: 'app-main',
  imports: [CommonModule, NavComponent, MainMapComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
