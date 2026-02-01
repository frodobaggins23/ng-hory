import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

type ColorOption = 'orange' | 'amber' | 'rose' | 'stone';

@Component({
  selector: 'app-statistics-interim-progress-card',
  imports: [NgClass],
  templateUrl: './interim-progress-card.component.html',
  styleUrl: './stats-card.component.scss',
})
export class InterimProgressCardComponent {
  @Input() color: ColorOption = 'rose';
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string;
}
