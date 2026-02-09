import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SectionHeaderComponent } from '../section-header/section-header.component';
import {
  transformDataToMonthlyFormat,
  getCommonChartOptions,
  LineChartDataPoint,
  ChartOptions,
} from '../charts.utils';

@Component({
  selector: 'app-statistics-monhtly-bar-chart',
  imports: [NgxChartsModule, SectionHeaderComponent],
  templateUrl: './monhtly-bar-chart.component.html',
  styleUrl: './monhtly-bar-chart.component.scss',
})
export class MonhtlyBarChartComponent implements OnChanges {
  @Input() monthlyClimbs: number[] = [];

  data: LineChartDataPoint[];
  chartOptions: ChartOptions;

  constructor() {
    this.data = [];
    this.chartOptions = getCommonChartOptions('#f97316', 'Počet výstupů');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monthlyClimbs']) {
      this.data = transformDataToMonthlyFormat(this.monthlyClimbs);
    }
  }
}
