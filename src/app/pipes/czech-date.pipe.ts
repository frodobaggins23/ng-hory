import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'czechDate',
  standalone: true,
})
export class CzechDatePipe implements PipeTransform {
  private datePipe = new DatePipe('cs-CZ');

  transform(
    value: Date | string | number | null | undefined,
    format: string = 'mediumDate'
  ): string | null {
    return this.datePipe.transform(value, format, '', 'cs-CZ');
  }
}
