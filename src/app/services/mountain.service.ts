import { Injectable } from '@angular/core';
import { mountains } from '../../data';
import { MountainName } from '../../data/types';

type MountainMapPoint = {
  name: MountainName;
  coordinates: L.LatLngExpression;
  altitude?: number;
  location?: string;
};

export type MountainDetails = {
  name: MountainName;
  location: string;
  altitude: string;
};

@Injectable({
  providedIn: 'root',
})
export class MountainService {
  allMountainPoints: MountainMapPoint[];
  allCoordinates: L.LatLngExpression[];

  constructor() {
    this.allMountainPoints = mountains.map(({ name, coordinates, altitude, location }) => ({
      name,
      coordinates,
      altitude,
      location,
    }));
    this.allCoordinates = mountains.map(({ coordinates }) => coordinates);
  }

  getAllMountainPoints(): MountainMapPoint[] {
    return this.allMountainPoints;
  }

  getAllCoordinates(): L.LatLngExpression[] {
    return this.allCoordinates;
  }

  getMountainDetails(mountainName: MountainName): MountainDetails {
    const { name, location, altitude } =
      this.allMountainPoints.find(mountain => mountain.name === mountainName) || {};

    return {
      name: name as MountainName,
      location: location ?? 'Neznámá lokalita',
      altitude: `${altitude ?? 0} m.n.m.`,
    };
  }
}
