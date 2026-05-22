import { Component, effect, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SectionHeaderComponent } from '../section-header/section-header.component';
import {
  transformDataToMonthlyFormat,
  getCommonChartOptions,
  LineChartDataPoint,
  ChartOptions,
} from '../charts.utils';
import { TranslateService } from '../../../services/translate.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-statistics-monhtly-bar-chart',
  imports: [NgxChartsModule, SectionHeaderComponent, TranslatePipe],
  templateUrl: './monhtly-bar-chart.component.html',
  styleUrl: './monhtly-bar-chart.component.scss',
})
export class MonhtlyBarChartComponent implements OnChanges {
  @Input() monthlyClimbs: number[] = [];

  private translateService = inject(TranslateService);
  private storedClimbs: number[] = [];

  data: LineChartDataPoint[];
  chartOptions: ChartOptions;

  constructor() {
    this.data = [];
    this.chartOptions = this.buildChartOptions();

    effect(() => {
      this.translateService.lang();
      this.chartOptions = this.buildChartOptions();
      this.data = transformDataToMonthlyFormat(this.storedClimbs, this.translateService.months());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monthlyClimbs']) {
      this.storedClimbs = this.monthlyClimbs;
      this.data = transformDataToMonthlyFormat(this.monthlyClimbs, this.translateService.months());
    }
  }

  private buildChartOptions(): ChartOptions {
    return getCommonChartOptions(
      '#f97316',
      this.translateService.get('charts.climbCountLabel'),
      this.translateService.months()
    );
  }
}
