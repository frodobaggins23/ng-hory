import { Component, Input } from '@angular/core';
import { RankingCardComponent } from '../ranking-card/ranking-card.component';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { MountainRankingStat } from '../../../services/statistics.service';
import { Rank } from '../rank-icon/rank-icon.component';

@Component({
  selector: 'app-statistics-ranking-container',
  imports: [RankingCardComponent, SectionHeaderComponent],
  templateUrl: './ranking-container.component.html',
  styleUrl: './ranking-container.component.scss',
})
export class RankingContainerComponent {
  @Input() rankings: MountainRankingStat[] = [];

  toRank(index: number): Rank {
    return (index + 1) as Rank;
  }
}
