import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistics-section-header',
  imports: [],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  @Input() title: string = '';
}
