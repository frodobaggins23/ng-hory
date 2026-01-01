import { Injectable } from '@angular/core';
import { mountains } from '../../data';
import { MountainName } from '../../data/types';

type MountainMapPoint = {
  name: MountainName;
  coordinates: L.LatLngExpression;
  altitude: number;
  location: string;
};

export type MountainDetails = {
  name: MountainName;
  location: string;
  altitude: string;
  description: string;
};

@Injectable({
  providedIn: 'root',
})
export class MountainService {
  allMountainPoints: MountainMapPoint[];
  allCoordinates: L.LatLngExpression[];

  constructor() {
    this.allMountainPoints = mountains.map(
      ({ name, coordinates, altitude, location, description }) => ({
        name,
        coordinates,
        altitude,
        location,
        description,
      })
    );
    this.allCoordinates = mountains.map(({ coordinates }) => coordinates);
  }

  getAllMountainPoints(): MountainMapPoint[] {
    return this.allMountainPoints;
  }

  getAllCoordinates(): L.LatLngExpression[] {
    return this.allCoordinates;
  }

  getMountainDetails(mountainName: MountainName): MountainDetails {
    const mountainData = mountains.find(mountain => mountain.name === mountainName);

    if (!mountainData) {
      throw new Error(`Mountain with name ${mountainName} not found.`);
    }

    const { name, location, altitude, description } = mountainData;

    return {
      name: name as MountainName,
      location,
      description,
      altitude: `${altitude ?? 0} m.n.m.`,
    };
  }
}
