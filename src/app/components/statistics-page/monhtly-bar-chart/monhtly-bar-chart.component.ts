import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SectionHeaderComponent } from '../section-header/section-header.component';
import {
  transformDataToMonthlyFormat,
  getCommonChartOptions,
  LineChartDataPoint,
  ChartOptions,
} from '../charts.utils';

const rawData = [3, 5, 1, 4, 2, 6, 3, 5, 2, 4, 1, 3];

@Component({
  selector: 'app-statistics-monhtly-bar-chart',
  imports: [NgxChartsModule, SectionHeaderComponent],
  templateUrl: './monhtly-bar-chart.component.html',
  styleUrl: './monhtly-bar-chart.component.scss',
})
export class MonhtlyBarChartComponent {
  data: LineChartDataPoint[];
  chartOptions: ChartOptions;

  constructor() {
    this.data = transformDataToMonthlyFormat(rawData);
    this.chartOptions = getCommonChartOptions('#f97316', 'Počet výstupů');
  }
}
