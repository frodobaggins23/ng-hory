import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-speedmeter',
  imports: [CommonModule],
  templateUrl: './speedmeter.component.html',
  styleUrl: './speedmeter.component.scss',
})
export class SpeedmeterComponent {
  @Input() value!: string;
  @Input() label!: string;
  @Input() type!: 'distance' | 'elevation' | 'heart-rate' | 'duration';
  @Input() animate: boolean = false;
}
