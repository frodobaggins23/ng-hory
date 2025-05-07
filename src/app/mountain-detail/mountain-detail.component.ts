import { Component, Input } from '@angular/core';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-mountain-detail',
  imports: [TableComponent],
  templateUrl: './mountain-detail.component.html',
  styleUrl: './mountain-detail.component.scss',
})
export class MountainDetailComponent {
  @Input() mountain: string = '';
}
