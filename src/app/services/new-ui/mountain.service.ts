import { Injectable } from '@angular/core';
import { mountains } from '../../../data';

type MountainMapPoint = {
  name: string;
  coordinates: L.LatLngExpression;
};

@Injectable({
  providedIn: 'root',
})
export class MountainService {
  allMountainPoints: MountainMapPoint[] = [];
  allCoordinates: L.LatLngExpression[] = [];

  constructor() {
    mountains.map(({ name, coordinates }) => {
      this.allMountainPoints.push({ name, coordinates });
      this.allCoordinates.push(coordinates);
    });
  }

  getAllMountainPoints(): MountainMapPoint[] {
    return this.allMountainPoints;
  }

  getAllCoordinates(): L.LatLngExpression[] {
    return this.allCoordinates;
  }
}
