import { forkJoin } from 'rxjs';
import { IconService } from '../../../icon.service';

export interface LoadedIcons {
  mountain: string;
  trendingUp: string;
}

export class IconLoader {
  private icons: LoadedIcons | null = null;
  private loading: Promise<LoadedIcons> | null = null;

  constructor(private iconService: IconService) {}

  async load(): Promise<LoadedIcons> {
    if (this.icons) {
      return Promise.resolve(this.icons);
    }

    if (this.loading) {
      return this.loading;
    }

    this.loading = new Promise(resolve => {
      forkJoin({
        mountain: this.iconService.getSvg('mountain'),
        trendingUp: this.iconService.getSvg('trending-up'),
      }).subscribe(icons => {
        this.icons = icons;
        resolve(icons);
      });
    });

    return this.loading;
  }

  getIcons(): LoadedIcons | null {
    return this.icons;
  }

  isLoaded(): boolean {
    return this.icons !== null;
  }
}
