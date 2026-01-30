import { Component } from '@angular/core';
import { RankingCardComponent } from '../ranking-card/ranking-card.component';
import { SectionHeaderComponent } from '../section-header/section-header.component';

@Component({
  selector: 'app-statistics-ranking-container',
  imports: [RankingCardComponent, SectionHeaderComponent],
  templateUrl: './ranking-container.component.html',
  styleUrl: './ranking-container.component.scss',
})
export class RankingContainerComponent {}
