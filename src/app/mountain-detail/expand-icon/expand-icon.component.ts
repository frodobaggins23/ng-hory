import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mountain-detail-expand-icon',
  imports: [CommonModule],
  templateUrl: './expand-icon.component.html',
  styleUrl: './expand-icon.component.scss',
})
export class ExpandIconComponent {
  @Input() handleClick: () => void = () => {};
  @Input() isExpanded: boolean = false;
}
