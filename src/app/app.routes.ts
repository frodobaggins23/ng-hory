import { Routes } from '@angular/router';
import { MainComponent } from './new-ui/main/main.component';
import { DetailPageComponent } from './new-ui/detail-page/detail-page.component';

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
