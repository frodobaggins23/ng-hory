import { Pipe, PipeTransform } from '@angular/core';
import { secondsToDuration } from '../utils/duration.utils';

/**
 * Angular pipe to format duration in seconds to HH:MM:SS string
 *
 * @example
 * {{ 6426 | duration }} // outputs "01:47:06"
 * {{ climb.duration | duration }} // outputs formatted duration
 */
@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(seconds: number): string {
    return secondsToDuration(seconds);
  }
}
