import { Routes } from '@angular/router';
import { MainComponent } from './new-ui/main/main.component';
import { MainComponent as MainComponentOld } from './main/main.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponentOld,
  },
  {
    path: 'new',
    component: MainComponent,
  },
];
