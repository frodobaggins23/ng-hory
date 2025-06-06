import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor() {}

  getCdnUrl(imageName: string): string {
    let url = environment.cdnHost + environment.cdnFolder;
    if (!url.endsWith('/')) url += '/';
    return url + imageName;
  }
}
