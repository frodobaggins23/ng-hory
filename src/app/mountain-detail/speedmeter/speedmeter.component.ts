import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-speedmeter',
  imports: [CommonModule],
  templateUrl: './speedmeter.component.html',
  styleUrl: './speedmeter.component.scss',
})
export class SpeedmeterComponent {
  @Input() value!: string | number;
  @Input() label!: string;
  @Input() type!: 'distance' | 'elevation' | 'heart-rate' | 'duration';
  @Input() animate: boolean = false;

  get displayValue(): string {
    if (typeof this.value === 'number') {
      const durationPipe = new DurationPipe();
      return durationPipe.transform(this.value);
    }
    return this.value;
  }
}
