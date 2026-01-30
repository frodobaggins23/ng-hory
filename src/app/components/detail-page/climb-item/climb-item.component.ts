import { Component, Input, OnInit, inject, signal } from '@angular/core';

import { Climb } from '../../../../data/types';
import { ImageService } from '../../../services/image.service';
import { ClimbItemMainPhotoComponent } from './climb-item-main-photo/climb-item-main-photo.component';
import { ClimbItemCollapsedContentComponent } from './climb-item-collapsed-content/climb-item-collapsed-content.component';
import { ClimbItemExpandedContentComponent } from './climb-item-expanded-content/climb-item-expanded-content.component';

@Component({
  selector: 'app-climb-item',
  imports: [
    ClimbItemMainPhotoComponent,
    ClimbItemCollapsedContentComponent,
    ClimbItemExpandedContentComponent,
  ],
  templateUrl: './climb-item.component.html',
  styleUrl: './climb-item.component.scss',
  host: {
    class: 'block w-full',
  },
})
export class ClimbItemComponent implements OnInit {
  private imageService = inject(ImageService);

  @Input() climb!: Climb;
  @Input() isNewest: boolean = false;
  @Input() mountainName: string = '';
  @Input() imgFolder: string = '';

  expanded: boolean = false;
  thumbnailUrl = signal<string | null>(null);

  ngOnInit() {
    if (this.climb.imgs && this.climb.imgs.length > 0) {
      this.loadThumbnail();
    }
  }

  private loadThumbnail() {
    if (!this.climb.imgs || this.climb.imgs.length === 0) return;

    this.imageService
      .getImageUrl(this.mountainName, this.climb.imgs[0], this.imgFolder)
      .subscribe(result => {
        this.thumbnailUrl.set(result.url);
      });
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
