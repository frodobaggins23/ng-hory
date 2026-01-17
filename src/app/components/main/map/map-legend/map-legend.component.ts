import { Component, Input } from '@angular/core';
import { IconComponent } from '../../../icon/icon.component';

@Component({
  selector: 'app-map-legend',
  imports: [IconComponent],
  templateUrl: './map-legend.component.html',
  styleUrl: './map-legend.component.scss',
})
export class MapLegendComponent {
  @Input() mountainCount: number = 0;
  @Input() climbCount: number = 0;
}
