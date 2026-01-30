import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SectionHeaderComponent } from '../section-header/section-header.component';

const MONTHS = [
  'leden',
  'únor',
  'březen',
  'duben',
  'květen',
  'červen',
  'červenec',
  'srpen',
  'září',
  'říjen',
  'listopad',
  'prosinec',
];

@Component({
  selector: 'app-statistics-monhtly-bar-chart',
  imports: [NgxChartsModule, SectionHeaderComponent],
  templateUrl: './monhtly-bar-chart.component.html',
  styleUrl: './monhtly-bar-chart.component.scss',
})
export class MonhtlyBarChartComponent {
  data = [
    {
      name: MONTHS[0],
      value: 3,
    },
    {
      name: MONTHS[1],
      value: 5,
    },
    {
      name: MONTHS[2],
      value: 1,
    },
    {
      name: MONTHS[3],
      value: 4,
    },
    {
      name: MONTHS[4],
      value: 2,
    },
    {
      name: MONTHS[5],
      value: 6,
    },
    {
      name: MONTHS[6],
      value: 3,
    },
    {
      name: MONTHS[7],
      value: 5,
    },
    {
      name: MONTHS[8],
      value: 2,
    },
    {
      name: MONTHS[9],
      value: 4,
    },
    {
      name: MONTHS[10],
      value: 1,
    },
    {
      name: MONTHS[11],
      value: 3,
    },
  ];

  formatXAxisLabel(value: string): number {
    return MONTHS.indexOf(value) + 1;
  }

  // options
  colorScheme: Color = {
    name: 'unified',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#f97316'],
  };
  showXAxis = true;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showGridLines = false;
  showXAxisLabel = false;
  showYAxisLabel = false;
  xAxisLabel = 'Měsíc';
  yAxisLabel = 'Počet výstupů';
}
