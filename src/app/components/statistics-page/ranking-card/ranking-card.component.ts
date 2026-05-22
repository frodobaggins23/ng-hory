import { Component, Input } from '@angular/core';
import { Rank, RankIconComponent } from '../rank-icon/rank-icon.component';
import { ElevationPipe } from '../../../pipes/elevation.pipe';
import { IconComponent } from '../../icon/icon.component';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-statistics-ranking-card',
  imports: [RankIconComponent, ElevationPipe, IconComponent, TranslatePipe],
  templateUrl: './ranking-card.component.html',
  styleUrl: './ranking-card.component.scss',
})
export class RankingCardComponent {
  @Input({ required: true }) mountain!: string;
  @Input({ required: true }) visits!: number;
  @Input({ required: true }) rank!: Rank;
  @Input({ required: true }) elevation!: number;
  @Input({ required: true }) altitude!: number;
  @Input({ required: true }) sharePercentage!: number;
}
