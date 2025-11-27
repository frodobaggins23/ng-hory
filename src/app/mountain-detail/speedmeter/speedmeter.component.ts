import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DurationPipe } from '../../pipes/duration.pipe';
import { DistancePipe } from '../../pipes/distance.pipe';
import { ElevationPipe } from '../../pipes/elevation.pipe';
import { HeartRatePipe } from '../../pipes/heartRate.pipe';

@Component({
  selector: 'app-speedmeter',
  imports: [CommonModule],
  templateUrl: './speedmeter.component.html',
  styleUrl: './speedmeter.component.scss',
})
export class SpeedmeterComponent {
  @Input() value!: number;
  @Input() label!: string;
  @Input() type!: 'distance' | 'elevation' | 'heart-rate' | 'duration';
  @Input() animate: boolean = false;

  get displayValue(): string {
    if (this.type === 'distance') {
      const distancePipe = new DistancePipe();
      return distancePipe.transform(this.value);
    }
    if (this.type === 'duration') {
      const durationPipe = new DurationPipe();
      return durationPipe.transform(this.value);
    }
    if (this.type === 'elevation') {
      const elevationPipe = new ElevationPipe();
      return elevationPipe.transform(this.value);
    }
    if (this.type === 'heart-rate') {
      const heartRatePipe = new HeartRatePipe();
      return heartRatePipe.transform(this.value);
    }

    return String(this.value);
  }
}
