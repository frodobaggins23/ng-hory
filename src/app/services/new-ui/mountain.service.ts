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
  allMountainPoints: MountainMapPoint[];
  allCoordinates: L.LatLngExpression[];

  constructor() {
    this.allMountainPoints = mountains.map(({ name, coordinates }) => ({
      name,
      coordinates,
    }));
    this.allCoordinates = mountains.map(({ coordinates }) => coordinates);
  }

  getAllMountainPoints(): MountainMapPoint[] {
    return this.allMountainPoints;
  }

  getAllCoordinates(): L.LatLngExpression[] {
    return this.allCoordinates;
  }
}
