import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LeafletMapComponent, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Hory';
}
