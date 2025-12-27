import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../icon/icon.component';

export type BadgeVariant = 'imgs' | 'gps' | 'newest';

@Component({
  selector: 'app-climb-item-badge',
  imports: [CommonModule, IconComponent],
  templateUrl: './climb-item-badge.component.html',
  styleUrl: './climb-item-badge.component.scss',
})
export class ClimbItemBadgeComponent {
  @Input() variant: BadgeVariant = 'imgs';
  @Input() count?: number;
  @Input() isDesktop: boolean = false;
}

