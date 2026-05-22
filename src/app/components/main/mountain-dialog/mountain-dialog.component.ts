import { Component, Input, Output, EventEmitter } from '@angular/core';

import { IconComponent } from '../../icon/icon.component';
import { TranslatePipe } from '../../../pipes/translate.pipe';

export interface MountainStatistic {
  getValue: () => string;
  labelKey: string;
}

@Component({
  selector: 'app-main-mountain-dialog',
  imports: [IconComponent, TranslatePipe],
  templateUrl: './mountain-dialog.component.html',
  styleUrl: './mountain-dialog.component.scss',
})
export class MountainDialogComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() statistics: MountainStatistic[] = [];
  @Input() actionButtonText: string = '';

  @Output() closeOutput = new EventEmitter<void>();
  @Output() actionClickOutput = new EventEmitter<void>();

  onClose(): void {
    this.closeOutput.emit();
  }

  onActionClick(): void {
    this.actionClickOutput.emit();
  }
}
