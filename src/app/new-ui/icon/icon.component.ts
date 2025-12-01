import { Component, inject, Input, OnInit } from '@angular/core';
import { IconName, IconService } from '../../icon.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type IconColor = 'primary-light' | 'primary-dark' | 'accent-light' | 'accent-dark' | 'none';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent implements OnInit {
  @Input() icon: IconName = 'home';
  @Input() fill: IconColor = 'none';
  @Input() stroke: IconColor = 'none';
  @Input() background: IconColor = 'none';
  @Input() size: number = 24;
  @Input() rounded: boolean = false;

  iconService = inject(IconService);
  domSanitizer = inject(DomSanitizer);

  sanitizedSvg?: SafeHtml;

  constructor() {}

  ngOnInit() {
    this.iconService.getSvg(this.icon).subscribe((svgContent: string) => {
      this.sanitizedSvg = this.domSanitizer.bypassSecurityTrustHtml(svgContent);
    });
  }

  public getColor(color: IconColor): string {
    switch (color) {
      case 'primary-light':
        return '#fff7ed';
      case 'primary-dark':
        return '#ea580c';
      case 'accent-light':
        return '#eab308';
      case 'accent-dark':
        return '#ca8a04';
      case 'none':
      default:
        return 'transparent';
    }
  }
}
