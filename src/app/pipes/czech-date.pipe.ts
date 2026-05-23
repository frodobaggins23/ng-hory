import { Pipe, PipeTransform, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'czechDate',
  standalone: true,
  pure: false,
})
export class CzechDatePipe implements PipeTransform {
  private translateService = inject(TranslateService);

  private readonly pipes = {
    'cs-CZ': new DatePipe('cs-CZ'),
    'en-US': new DatePipe('en-US'),
  };

  transform(
    value: Date | string | number | null | undefined,
    format: string = 'mediumDate'
  ): string | null {
    const locale = this.translateService.lang() === 'cs' ? 'cs-CZ' : 'en-US';
    return this.pipes[locale].transform(value, format, '', locale);
  }
}
