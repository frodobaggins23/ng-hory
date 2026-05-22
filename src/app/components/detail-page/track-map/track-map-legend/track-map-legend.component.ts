import { Component } from '@angular/core';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-track-map-legend',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './track-map-legend.component.html',
  styleUrl: './track-map-legend.component.scss',
})
export class TrackMapLegendComponent {}
