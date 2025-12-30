import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { DetailPageComponent } from './components/detail-page/detail-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'detail',
    component: DetailPageComponent,
  },
];
