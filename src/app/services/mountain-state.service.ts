import { Injectable, signal } from '@angular/core';
import { mountains, type Mountain } from '../../data';
import { MountainName } from '../../data/types';

@Injectable({
  providedIn: 'root',
})
export class MountainStateService {
  mountainName = signal<MountainName>(mountains[0].name);
  mountainCoordinates = signal<L.LatLngExpression>(mountains[0].coordinates);

  setMountain(mountain: Mountain) {
    this.mountainName.set(mountain.name);
    this.mountainCoordinates.set(mountain.coordinates);
  }

  setMountainByName(mountainName: MountainName) {
    const mountain = mountains.find(mountain => mountain.name === mountainName);
    if (mountain) {
      this.setMountain(mountain);
    }
  }

  getCurrentMountain(): Mountain {
    return mountains.find(mountain => mountain.name === this.mountainName())!;
  }
}
