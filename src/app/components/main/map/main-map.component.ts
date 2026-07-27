import { AfterViewInit, Component, DestroyRef, inject, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MapService } from '../../../services/map.service';
import { ConfigService } from '../../../config/config.service';
import {
  MountainDialogComponent,
  MountainStatistic,
} from '../mountain-dialog/mountain-dialog.component';
import { StatisticsService } from '../../../services/statistics.service';
import { MountainName } from '../../../../data/types';
import { MountainService } from '../../../services/mountain.service';
import { MountainStateService } from '../../../services/mountain-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-map',
  imports: [MountainDialogComponent],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent implements AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private configService = inject(ConfigService);
  mapService = inject(MapService);
  statisticsService = inject(StatisticsService);
  mountainService = inject(MountainService);
  mountainStateService = inject(MountainStateService);
  router = inject(Router);
  viewContainerRef = inject(ViewContainerRef);

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
    const mapTileUrl = this.configService.buildMapTileUrl();
    await this.mapService.initMap('map', mapTileUrl, this.viewContainerRef);

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
    this.router.navigate(['/detail']);
  }
}
