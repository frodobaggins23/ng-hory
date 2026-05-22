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

  transform(
    value: Date | string | number | null | undefined,
    format: string = 'mediumDate'
  ): string | null {
    const locale = this.translateService.lang() === 'cs' ? 'cs-CZ' : 'en-US';
    return new DatePipe(locale).transform(value, format, '', locale);
  }
}
