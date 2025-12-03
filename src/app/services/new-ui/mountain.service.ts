import { Injectable } from '@angular/core';
import { mountains } from '../../../data';

@Injectable({
  providedIn: 'root',
})
export class MountainService {
  allMountainPoints: L.LatLngExpression[] = [];

  constructor() {
    mountains.map(mountain => {
      this.allMountainPoints.push(mountain.coordinates);
    });
  }

  getAllMountainPoints(): L.LatLngExpression[] {
    return this.allMountainPoints;
  }
}
