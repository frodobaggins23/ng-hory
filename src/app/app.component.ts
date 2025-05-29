import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { IntroPageComponent } from './intro-page/intro-page.component';
import { CommonModule } from '@angular/common';

const TRANSITION_TIME = 300;

@Component({
  selector: 'app-root',
  host: { '[class.scrolled]': 'introScrolled' },
  imports: [
    RouterOutlet,
    CommonModule,
    LeafletMapComponent,
    IntroPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Hory';
  showMap = false;
  introScrolled = false;

  onIntroScrolled() {
    this.introScrolled = true;
    setTimeout(() => {
      this.showMap = true;
    }, TRANSITION_TIME);
  }
}
