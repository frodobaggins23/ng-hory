import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe to format distance in meters to kilometers
 *
 * @example
 * {{ 6426 | distance }} // outputs "6.46km"
 */
@Pipe({
  name: 'distance',
  standalone: true,
})
export class DistancePipe implements PipeTransform {
  transform(distance: number): string {
    const distanceKm2Decimals = Math.floor(distance / 10) / 100;
    return `${distanceKm2Decimals} km`;
  }
}
