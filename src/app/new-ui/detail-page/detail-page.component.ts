import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { HeroComponent } from './hero/hero.component';
import { StatsCardComponent } from './stats-card/stats-card.component';

@Component({
  selector: 'app-detail-page',
  imports: [NavComponent, HeroComponent, StatsCardComponent],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
})
export class DetailPageComponent {}
