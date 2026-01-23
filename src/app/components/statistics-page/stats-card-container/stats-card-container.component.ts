import { Component } from '@angular/core';
import { StatsCardComponent } from '../stats-card/stats-card.component';

@Component({
  selector: 'app-statistics-stats-card-container',
  imports: [StatsCardComponent],
  templateUrl: './stats-card-container.component.html',
  styleUrl: './stats-card-container.component.scss',
})
export class StatsCardContainerComponent {}
