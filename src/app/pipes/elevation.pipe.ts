import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe to format elevation in meters
 *
 * @example
 * {{ 144 | elevation }} // outputs "144 m"
 */
@Pipe({
  name: 'elevation',
  standalone: true,
})
export class ElevationPipe implements PipeTransform {
  transform(elevation: number): string {
    return `${elevation} m`;
  }
}
