import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

export type Rank = 1 | 2 | 3 | 4 | 5;

@Component({
  selector: 'app-statistics-rank-icon',
  imports: [NgClass],
  templateUrl: './rank-icon.component.html',
  styleUrl: './rank-icon.component.scss',
})
export class RankIconComponent {
  @Input({ required: true }) rank!: Rank;

  get rankClass(): string {
    switch (this.rank) {
      case 1:
        return 'first';
      case 2:
        return 'second';
      case 3:
        return 'third';
      default:
        return 'other';
    }
  }
}
