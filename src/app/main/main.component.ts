import { Component } from '@angular/core';
import { IntroPageComponent } from '../intro-page/intro-page.component';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { CommonModule } from '@angular/common';

const TRANSITION_TIME = 1200;

@Component({
  selector: 'app-main',
  host: { '[class.scrolled]': 'introScrolled' },
  imports: [IntroPageComponent, LeafletMapComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
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
