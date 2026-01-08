import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { RequestService } from '../request.service';

export type IconName =
  | 'arrow-up'
  | 'bar-chart-3'
  | 'calendar'
  | 'camera'
  | 'chevron-right'
  | 'clock'
  | 'footprints'
  | 'heart'
  | 'home'
  | 'lock'
  | 'map-pin'
  | 'map'
  | 'mountain'
  | 'trending-up'
  | 'unlock'
  | 'x';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private svgCache: Map<IconName, string> = new Map();
  private requestService = inject(RequestService);

  constructor() {}

  getSvg(iconName: IconName): Observable<string> {
    const icon = this.svgCache.get(iconName);
    if (icon) {
      return of(icon);
    }
    return this.requestService
      .request({
        method: 'get',
        path: `/assets/icons/${iconName}.svg`,
        responseType: 'text',
        doNotAuthorize: true,
      })
      .pipe(
        tap((svgContent: string) => {
          this.svgCache.set(iconName, svgContent);
        })
      ) as Observable<string>;
  }
}
