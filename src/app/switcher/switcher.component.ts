import { Component, Input } from '@angular/core';
import { MountainStateService } from '../services/mountain-state.service';

@Component({
  selector: 'app-switcher',
  imports: [],
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.scss',
})
export class SwitcherComponent {
  constructor(private mountainStateService: MountainStateService) {}

  setNextMountainName() {
    this.mountainStateService.setNextMountain();
  }
  setPreviousMountainName() {
    this.mountainStateService.setPreviousMountain();
  }

  @Input() location: string = 'location';
}
