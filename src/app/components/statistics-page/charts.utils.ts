import { Color, ScaleType } from '@swimlane/ngx-charts';

export type ChartOptions = {
  colorScheme: Color;
  showXAxis: boolean;
  showYAxis: boolean;
  gradient: boolean;
  showLegend: boolean;
  showGridLines: boolean;
  showXAxisLabel: boolean;
  showYAxisLabel: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  formatXAxisLabel?: (value: string) => number;
};

export type LineChartDataPoint = {
  name: string;
  value: number;
};

export type AreaChartDataPoint = {
  name: string;
  series: LineChartDataPoint[];
};

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

export const getCommonChartOptions = (color: string, yAxisLabel: string): ChartOptions => {
  return {
    colorScheme: {
      name: 'ng-hory-theme',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: [color],
    },
    showXAxis: true,
    showYAxis: false,
    gradient: false,
    showLegend: false,
    showGridLines: false,
    showXAxisLabel: false,
    showYAxisLabel: false,
    xAxisLabel: 'Měsíc',
    yAxisLabel,
    formatXAxisLabel: value => {
      return MONTHS.indexOf(value) + 1;
    },
  };
};

export const transformDataToMonthlyFormat = (data: number[]): LineChartDataPoint[] => {
  return MONTHS.map((month, index) => ({
    name: month,
    value: data[index] || 0,
  }));
};

export const transformDataToMonthlyFormatForAreaChart = (
  data: number[],
  seriesName: string
): AreaChartDataPoint[] => {
  return [
    {
      name: seriesName,
      series: transformDataToMonthlyFormat(data),
    },
  ];
};
