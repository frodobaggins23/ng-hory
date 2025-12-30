import {
  Injectable,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  ApplicationRef,
  inject,
} from '@angular/core';
import { ImageOverlayComponent } from '../components/image-overlay/image-overlay.component';

export interface OverlayConfig {
  imageUrl: string;
  altText: string;
  images?: string[];
  showNavigation?: boolean;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private overlayRef: ComponentRef<ImageOverlayComponent> | null = null;

  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

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
    this.overlayRef.setInput('images', config.images || []);
    this.overlayRef.setInput('showNavigation', config.showNavigation || false);

    // Listen for close events
    this.overlayRef.instance.closeOverlay.subscribe(() => {
      this.closeOverlay();
    });

    // Listen for navigation events
    if (config.onNavigateNext) {
      this.overlayRef.instance.navigateNext.subscribe(() => {
        config.onNavigateNext!();
      });
    }

    if (config.onNavigatePrev) {
      this.overlayRef.instance.navigatePrev.subscribe(() => {
        config.onNavigatePrev!();
      });
    }

    // Attach to application
    this.appRef.attachView(this.overlayRef.hostView);

    // Append to body
    document.body.appendChild(this.overlayRef.location.nativeElement);
  }

  updateOverlayImage(imageUrl: string): void {
    if (this.overlayRef) {
      this.overlayRef.setInput('imageUrl', imageUrl);
    }
  }

  closeOverlay(): void {
    if (this.overlayRef) {
      this.appRef.detachView(this.overlayRef.hostView);
      this.overlayRef.destroy();
      this.overlayRef = null;
    }
  }
}
