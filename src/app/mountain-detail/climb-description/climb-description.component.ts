import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-climb-description',
  imports: [],
  templateUrl: './climb-description.component.html',
  styleUrl: './climb-description.component.scss'
})
export class ClimbDescriptionComponent {
  @Input() description!: string;
  @Input() title: string = 'Details';
}
