import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MountainStateService } from '../services/mountain-state.service';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-switcher',
  imports: [CommonModule],
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.scss',
})
export class SwitcherComponent {
  @Input({ required: true }) handleClick!: () => void;

  public mountainStateService = inject(MountainStateService);
  public mapService = inject(MapService);

  setNextMountainName() {
    this.mountainStateService.setNextMountain();
  }
  setPreviousMountainName() {
    this.mountainStateService.setPreviousMountain();
  }
}
