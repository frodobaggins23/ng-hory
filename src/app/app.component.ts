import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UnlockGalleryComponent } from './components/unlock-gallery/unlock-gallery.component';
import { InitService } from './init.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UnlockGalleryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  initService = inject(InitService);
}
