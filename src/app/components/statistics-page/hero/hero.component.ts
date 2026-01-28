import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [NgClass],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  @Input() selectedYear?: string;

  private router = inject(Router);

  navigateToYear(year: number): void {
    this.router.navigate(['/stats', year], { replaceUrl: true });
  }

  isSelectedYear(year: number): boolean {
    return Number(this.selectedYear) === year;
  }
}
