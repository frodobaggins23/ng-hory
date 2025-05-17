import { Component, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MountainStateService } from '../services/mountain-state.service';
import { MapService } from '../services/map.service';
import { MountainDetailComponent } from '../mountain-detail/mountain-detail.component';

@Component({
  selector: 'app-switcher',
  imports: [MountainDetailComponent, CommonModule],
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.scss',
})
export class SwitcherComponent {
  constructor(
    public mountainStateService: MountainStateService,
    public mapService: MapService
  ) {}

  showMountainDetail: boolean = false;

  setNextMountainName() {
    this.mountainStateService.setNextMountain();
  }
  setPreviousMountainName() {
    this.mountainStateService.setPreviousMountain();
  }

  toggleMountainDetail() {
    console.log('toggleMountainDetail');
    this.showMountainDetail = !this.showMountainDetail;
  }

  hideTrack() {
    this.mapService.hideTrack();
    this.mapService.centerMap(this.mountainStateService.mountainCoordinates());
  }
}
