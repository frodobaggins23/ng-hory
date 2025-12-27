import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoGalleryComponent } from '../../../photo-gallery/photo-gallery.component';

@Component({
  selector: 'app-climb-gallery',
  standalone: true,
  imports: [CommonModule, PhotoGalleryComponent],
  templateUrl: './climb-gallery.component.html',
  styleUrl: './climb-gallery.component.scss',
})
export class ClimbGalleryComponent {
  @Input() images: string[] = [];
  @Input() mountainName: string = '';
  @Input() imgFolder: string = '';
}
