import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  getCommonChartOptions,
  ChartOptions,
  AreaChartDataPoint,
  transformDataToMonthlyFormatForAreaChart,
} from '../charts.utils';

@Component({
  selector: 'app-statistics-cumulative-elevation-chart',
  imports: [SectionHeaderComponent, NgxChartsModule],
  templateUrl: './cumulative-elevation-chart.component.html',
  styleUrl: './cumulative-elevation-chart.component.scss',
})
export class CumulativeElevationChartComponent implements OnChanges {
  @Input() cumulativeElevation: number[] = [];

  data: AreaChartDataPoint[];
  areaOptions: ChartOptions;
  lineOptions: ChartOptions;

  constructor() {
    this.data = [];
    this.areaOptions = getCommonChartOptions('#fdba74', 'Převýšení (m)');
    this.lineOptions = getCommonChartOptions('#ea580c', 'Převýšení (m)');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cumulativeElevation']) {
      this.data = transformDataToMonthlyFormatForAreaChart(
        this.cumulativeElevation,
        'Kumulativní převýšení'
      );
    }
  }
}
