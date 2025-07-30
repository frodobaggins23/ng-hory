import { Injectable, signal } from '@angular/core';
import { mountains, type Mountain } from '../../data';

@Injectable({
  providedIn: 'root',
})
export class MountainStateService {
  mountainName = signal<string>(mountains[0].name);
  mountainCoordinates = signal<L.LatLngExpression>(mountains[0].coordinates);

  private changeMountain(offset: number) {
    const currentIndex = mountains.findIndex(mountain => mountain.name === this.mountainName());
    const newIndex = (currentIndex + offset + mountains.length) % mountains.length;
    this.setMountain(mountains[newIndex]);
  }

  setNextMountain() {
    this.changeMountain(1);
  }

  setPreviousMountain() {
    this.changeMountain(-1);
  }

  setMountain(mountain: Mountain) {
    this.mountainName.set(mountain.name);
    this.mountainCoordinates.set(mountain.coordinates);
  }

  getCurrentMountain(): Mountain {
    return mountains.find(mountain => mountain.name === this.mountainName())!;
  }
}
