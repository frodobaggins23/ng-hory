import { Component } from '@angular/core';
import { InterimProgressCardComponent } from '../stats-card/interim-progress-card.component';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-statistics-not-enough-data',
  imports: [InterimProgressCardComponent, IconComponent],
  templateUrl: './not-enough-data.component.html',
  styleUrl: './not-enough-data.component.scss',
})
export class NotEnoughDataComponent {}
