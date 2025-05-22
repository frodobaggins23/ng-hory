import { Component, WritableSignal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MountainStateService } from '../services/mountain-state.service';
import { MapService } from '../services/map.service';
import { MountainDetailComponent } from '../mountain-detail/mountain-detail.component';

@Component({
  selector: 'app-switcher',
  imports: [CommonModule],
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.scss',
})
export class SwitcherComponent {
  @Input({ required: true }) handleClick!: () => void;

  constructor(
    public mountainStateService: MountainStateService,
    public mapService: MapService
  ) {}

  setNextMountainName() {
    this.mountainStateService.setNextMountain();
  }
  setPreviousMountainName() {
    this.mountainStateService.setPreviousMountain();
  }
}
