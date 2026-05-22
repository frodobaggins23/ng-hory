import { Component, Input } from '@angular/core';

import { ClimbItemComponent } from '../climb-item/climb-item.component';
import { IconComponent } from '../../icon/icon.component';
import { Climb } from '../../../../data/types';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-climb-history',
  imports: [ClimbItemComponent, IconComponent, TranslatePipe],
  templateUrl: './climb-history.component.html',
  styleUrl: './climb-history.component.scss',
})
export class ClimbHistoryComponent {
  @Input() climbs: Climb[] = [];
  @Input() mountainName: string = '';
  @Input() imgFolder: string = '';
}
