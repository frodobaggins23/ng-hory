import { Component, inject, Input, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { HeroComponent } from './hero/hero.component';
import { getCurrentYear } from '../../utils';
import { Router } from '@angular/router';
import { StatsCardContainerComponent } from './stats-card-container/stats-card-container.component';

@Component({
  selector: 'app-statistics-page',
  imports: [NavComponent, HeroComponent, StatsCardContainerComponent],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss',
})
export class StatisticsPageComponent implements OnInit {
  @Input() year?: string;

  private router = inject(Router);

  get currentYear(): number {
    return getCurrentYear();
  }

  ngOnInit(): void {
    if (!this.year) {
      this.router.navigate(['/stats', this.currentYear]);
    }
  }
}
