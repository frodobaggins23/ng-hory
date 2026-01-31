import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  getCommonChartOptions,
  ChartOptions,
  AreaChartDataPoint,
  transformDataToMonthlyFormatForAreaChart,
} from '../charts.utils';

const rawData = [300, 550, 1020, 1540, 2500, 3300, 4300, 5000, 5500, 6000, 7000, 7500];

@Component({
  selector: 'app-statistics-cumulative-elevation-chart',
  imports: [SectionHeaderComponent, NgxChartsModule],
  templateUrl: './cumulative-elevation-chart.component.html',
  styleUrl: './cumulative-elevation-chart.component.scss',
})
export class CumulativeElevationChartComponent {
  data: AreaChartDataPoint[];
  areaOptions: ChartOptions;
  lineOptions: ChartOptions;

  constructor() {
    this.data = transformDataToMonthlyFormatForAreaChart(rawData, 'Kumulativní převýšení');
    this.areaOptions = getCommonChartOptions('#fdba74', 'Převýšení (m)');
    this.lineOptions = getCommonChartOptions('#ea580c', 'Převýšení (m)');
  }
}
