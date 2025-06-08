import {
  Injectable,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  ApplicationRef,
} from '@angular/core';
import { ImageOverlayComponent } from '../image-overlay/image-overlay.component';

export interface OverlayConfig {
  imageUrl: string;
  altText: string;
}

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private overlayRef: ComponentRef<ImageOverlayComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  openImageOverlay(config: OverlayConfig): void {
    if (this.overlayRef) {
      this.closeOverlay();
    }

    // Create the component
    this.overlayRef = createComponent(ImageOverlayComponent, {
      environmentInjector: this.injector,
    });

    // Set the inputs
    this.overlayRef.setInput('imageUrl', config.imageUrl);
    this.overlayRef.setInput('altText', config.altText);
    this.overlayRef.setInput('isVisible', true);

    // Listen for close events
    this.overlayRef.instance.closeOverlay.subscribe(() => {
      this.closeOverlay();
    });

    // Attach to application
    this.appRef.attachView(this.overlayRef.hostView);

    // Append to body
    document.body.appendChild(this.overlayRef.location.nativeElement);
  }

  closeOverlay(): void {
    if (this.overlayRef) {
      this.appRef.detachView(this.overlayRef.hostView);
      this.overlayRef.destroy();
      this.overlayRef = null;
    }
  }
}
