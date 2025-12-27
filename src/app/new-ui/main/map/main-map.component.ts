import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { MAPY_CZ_URL } from '../../../constants';
import { MapService } from '../../../services/new-ui/map.service';
import {
  MountainDialogComponent,
  MountainStatistic,
} from '../mountain-dialog/mountain-dialog.component';
import { StatisticsService } from '../../../services/new-ui/statistics.service';
import { MountainName } from '../../../../data/types';
import { MountainService } from '../../../services/new-ui/mountain.service';
import { MountainStateService } from '../../../services/mountain-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-map',
  imports: [CommonModule, MountainDialogComponent],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent implements AfterViewInit {
  private destroyRef = inject(DestroyRef);
  mapService = inject(MapService);
  statisticsService = inject(StatisticsService);
  mountainService = inject(MountainService);
  mountainStateService = inject(MountainStateService);
  router = inject(Router);

  showDialog: boolean = false;

  dialogParams = {
    selectedMountain: '' as MountainName,
    subtitle: '',
    totalClimbs: 0,
    totalElevationGain: 0,
    totalDistance: 0,
  };

  dialogStatistics: MountainStatistic[] = [
    { label: 'výstupů', getValue: () => String(this.dialogParams.totalClimbs) },
    { label: 'převýšení', getValue: () => `${this.dialogParams.totalElevationGain} m` },
    {
      label: 'v nohách',
      getValue: () => `${(this.dialogParams.totalDistance / 1000).toFixed(1)} km`,
    },
  ];

  async ngAfterViewInit() {
    await this.mapService.initMap('map', MAPY_CZ_URL);

    this.mapService.selectedMountainMarker$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mountainName: MountainName) => {
        this.dialogParams.selectedMountain = mountainName;
        const { totalClimbs, totalElevationGain, totalDistance } =
          this.statisticsService.getStatsForMountain(mountainName);
        const { location, altitude } = this.mountainService.getMountainDetails(mountainName);

        this.dialogParams = {
          ...this.dialogParams,
          subtitle: `${location} | ${altitude}`,
          totalClimbs,
          totalElevationGain,
          totalDistance,
        };
        this.handleDialogOpen();
      });
  }

  handleDialogOpen() {
    this.showDialog = true;
  }

  handleDialogClose() {
    this.showDialog = false;
  }

  handleDialogAction() {
    this.mountainStateService.setMountainByName(this.dialogParams.selectedMountain);
    this.showDialog = false;
    this.router.navigate(['/new/detail']);
  }
}
