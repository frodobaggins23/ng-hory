import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

type ColorOption = 'orange' | 'amber' | 'rose' | 'stone';
type CardPosition = '1' | '2' | '3' | '4';

@Component({
  selector: 'app-statistics-stats-card',
  imports: [NgClass],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss',
})
export class StatsCardComponent {
  @Input() color: ColorOption = 'rose';
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string;
  @Input({ required: true }) claim!: string;
  @Input({ required: true }) position!: CardPosition;
}
