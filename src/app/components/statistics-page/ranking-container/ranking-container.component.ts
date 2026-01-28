import { Component } from '@angular/core';
import { RankingCardComponent } from '../ranking-card/ranking-card.component';

@Component({
  selector: 'app-statistics-ranking-container',
  imports: [RankingCardComponent],
  templateUrl: './ranking-container.component.html',
  styleUrl: './ranking-container.component.scss',
})
export class RankingContainerComponent {}
