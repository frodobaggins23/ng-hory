import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeCs from '@angular/common/locales/cs';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { InitService } from './init.service';

registerLocaleData(localeCs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAppInitializer(() => {
      const initService = inject(InitService);
      initService.verifyGalleryToken();
    }),
  ],
};
