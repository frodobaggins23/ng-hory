import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-overlay.component.html',
  styleUrl: './image-overlay.component.scss'
})
export class ImageOverlayComponent {
  @Input() imageUrl: string = '';
  @Input() altText: string = 'Image preview';
  @Input() isVisible: boolean = false;
  @Output() closeOverlay = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeOverlay.emit();
  }
}