import { Component, Input } from '@angular/core';
import { IconColor, IconComponent } from '../../icon/icon.component';
import { IconName } from '../../../icon.service';

type CardColor = 'orange' | 'amber' | 'stone' | 'rose';

@Component({
  selector: 'app-stats-card',
  imports: [IconComponent],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss',
})
export class StatsCardComponent {
  @Input() icon: IconName = 'home';
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() color: CardColor = 'stone';

  getStrokeColor(): IconColor {
    switch (this.color) {
      case 'orange':
      case 'amber':
      case 'rose':
        return 'primary-dark';
      case 'stone':
        return 'text-secondary';
      default:
        return 'none';
    }
  }
}
