import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mountain-detail-thumbnail',
  imports: [CommonModule],
  templateUrl: './thumbnail.component.html',
  styleUrl: './thumbnail.component.scss',
})
export class ThumbnailComponent {
  @Input() imageUrl: string = '';
  @Input() isVisible: boolean = false;
  @Input() handleClick!: () => void;
}
