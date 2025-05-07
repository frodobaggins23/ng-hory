import { Component, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MountainStateService } from '../services/mountain-state.service';
import { MountainDetailComponent } from '../mountain-detail/mountain-detail.component';

@Component({
  selector: 'app-switcher',
  imports: [MountainDetailComponent, CommonModule],
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.scss',
})
export class SwitcherComponent {
  constructor(private mountainStateService: MountainStateService) {}

  showMountainDetail: boolean = false;
  mountainName!: WritableSignal<string>;

  ngOnInit() {
    this.mountainName = this.mountainStateService.mountainName;
  }

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
}
