import { Component, effect, inject } from '@angular/core';
import { IconComponent } from '../../icon/icon.component';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { MountainStateService } from '../../../services/mountain-state.service';
import { StatisticsService } from '../../../services/statistics.service';
import { MountainDetails, MountainService } from '../../../services/mountain.service';
import { MountainName } from '../../../../data/types';

@Component({
  selector: 'app-detail-page-hero',
  imports: [IconComponent, TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  public mountainStateService = inject(MountainStateService);
  public statisticsService = inject(StatisticsService);
  public mountainService = inject(MountainService);
  public mountainDetails: MountainDetails = {
    name: '' as MountainName,
    location: '',
    altitude: '',
    description: '',
  };

  constructor() {
    effect(() => {
      const mountainName = this.mountainStateService.mountainName();
      const details = this.mountainService.getMountainDetails(mountainName);
      this.mountainDetails = details;
    });
  }
}
