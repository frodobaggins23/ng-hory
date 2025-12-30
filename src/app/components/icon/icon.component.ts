import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { IconName, IconService } from '../../services/icon.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

export type IconColor =
  | 'primary-light'
  | 'primary-dark'
  | 'accent-light'
  | 'accent-dark'
  | 'text-primary'
  | 'text-secondary'
  | 'text-muted'
  | 'stone-200'
  | 'white'
  | 'rose'
  | 'none';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent implements OnInit, OnDestroy {
  @Input() icon: IconName = 'home';
  @Input() fill: IconColor = 'none';
  @Input() stroke: IconColor = 'none';
  @Input() background: IconColor = 'none';
  @Input() size: number = 24;
  @Input() rounded: boolean = false;

  private subscription?: Subscription;
  iconService = inject(IconService);
  domSanitizer = inject(DomSanitizer);

  sanitizedSvg?: SafeHtml;

  constructor() {}

  ngOnInit() {
    this.subscription = this.iconService.getSvg(this.icon).subscribe((svgContent: string) => {
      this.sanitizedSvg = this.domSanitizer.bypassSecurityTrustHtml(svgContent);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public getColor(color: IconColor): string {
    switch (color) {
      case 'primary-light':
        return 'var(--color-primary-light)';
      case 'primary-dark':
        return 'var(--color-primary-dark)';
      case 'accent-light':
        return 'var(--color-accent-light)';
      case 'accent-dark':
        return 'var(--color-accent-dark)';
      case 'text-primary':
        return 'var(--color-text-primary)';
      case 'text-secondary':
        return 'var(--color-text-secondary)';
      case 'text-muted':
        return 'var(--color-text-muted)';
      case 'stone-200':
        return 'var(--color-stone-200)';
      case 'white':
        return 'var(--color-white)';
      case 'rose':
        return 'var(--color-rose-500)';
      case 'none':
        return 'transparent';
      default:
        return 'currentColor';
    }
  }

  public hasVisibleBackground(): boolean {
    return this.background !== 'none';
  }
}
