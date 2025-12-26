import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe to format heartrate in bpm
 *
 * @example
 * {{ 122 | heartRate }} // outputs "122 bpm"
 */
@Pipe({
  name: 'heartRate',
  standalone: true,
})
export class HeartRatePipe implements PipeTransform {
  transform(heartRate: number): string {
    return `${Math.floor(heartRate)} bpm`;
  }
}
