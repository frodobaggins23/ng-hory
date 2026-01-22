import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { DetailPageComponent } from './components/detail-page/detail-page.component';
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'detail',
    component: DetailPageComponent,
  },
  {
    path: 'stats',
    component: StatisticsPageComponent,
  },
  {
    path: 'stats/:year',
    component: StatisticsPageComponent,
  },
];
