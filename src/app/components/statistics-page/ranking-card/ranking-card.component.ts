import { Component, Input } from '@angular/core';
import { Rank, RankIconComponent } from '../rank-icon/rank-icon.component';
import { ElevationPipe } from '../../../pipes/elevation.pipe';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-statistics-ranking-card',
  imports: [RankIconComponent, ElevationPipe, IconComponent],
  templateUrl: './ranking-card.component.html',
  styleUrl: './ranking-card.component.scss',
})
export class RankingCardComponent {
  @Input({ required: true }) mountain!: string;
  @Input({ required: true }) visits!: number;
  @Input({ required: true }) rank!: Rank;
  @Input({ required: true }) elevation!: number;

  public progressToDo: number = 75;

  constructor() {
    this.progressToDo = this.getRandomProgress();
  }

  private getRandomProgress(): number {
    return Math.floor(Math.random() * 101);
  }
}
