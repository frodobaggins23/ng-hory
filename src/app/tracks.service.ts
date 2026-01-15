import { inject, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TracksService {
  private requestService = inject(RequestService);

  constructor() {}

  loadTrack(trackPath: string) {
    return this.requestService.unauthorizedGetRequest({
      path: trackPath,
      responseType: 'json',
    }) as Observable<GeoJSON.GeoJsonObject>;
  }
}
