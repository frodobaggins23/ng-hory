import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mountain-detail-expand-content',
  imports: [CommonModule],
  templateUrl: './expand-content.component.html',
  styleUrl: './expand-content.component.scss',
})
export class ExpandContentComponent {
  @Input() expanded: boolean = false;
  @Input() content: string = '';
}
