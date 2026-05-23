import { Component, effect, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  getCommonChartOptions,
  ChartOptions,
  AreaChartDataPoint,
  transformDataToMonthlyFormatForAreaChart,
} from '../charts.utils';
import { TranslateService } from '../../../services/translate.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-statistics-cumulative-elevation-chart',
  imports: [SectionHeaderComponent, NgxChartsModule, TranslatePipe],
  templateUrl: './cumulative-elevation-chart.component.html',
  styleUrl: './cumulative-elevation-chart.component.scss',
})
export class CumulativeElevationChartComponent implements OnChanges {
  @Input() cumulativeElevation: number[] = [];

  private translateService = inject(TranslateService);
  private storedElevation: number[] = [];

  data: AreaChartDataPoint[];
  areaOptions: ChartOptions;
  lineOptions: ChartOptions;

  constructor() {
    this.data = [];
    this.areaOptions = this.buildAreaOptions();
    this.lineOptions = this.buildLineOptions();

    effect(() => {
      this.areaOptions = this.buildAreaOptions();
      this.lineOptions = this.buildLineOptions();
      if (this.storedElevation.length) {
        this.data = transformDataToMonthlyFormatForAreaChart(
          this.storedElevation,
          this.translateService.get('stats.cumulativeElevation'),
          this.translateService.months()
        );
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cumulativeElevation']) {
      this.storedElevation = this.cumulativeElevation;
      this.data = transformDataToMonthlyFormatForAreaChart(
        this.cumulativeElevation,
        this.translateService.get('stats.cumulativeElevation'),
        this.translateService.months()
      );
    }
  }

  private buildAreaOptions(): ChartOptions {
    return getCommonChartOptions(
      '#fdba74',
      this.translateService.get('charts.elevationLabel'),
      this.translateService.months()
    );
  }

  private buildLineOptions(): ChartOptions {
    return getCommonChartOptions(
      '#ea580c',
      this.translateService.get('charts.elevationLabel'),
      this.translateService.months()
    );
  }
}
