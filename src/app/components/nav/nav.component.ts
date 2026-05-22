import { Component, inject, computed } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, map, startWith } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../services/icon.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService, Language } from '../../services/translate.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface NavItem {
  id: 'home' | 'mountain' | 'stats';
  icon: IconName;
  labelKey: string;
  route: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  standalone: true,
  imports: [IconComponent, TranslatePipe],
})
export class NavComponent {
  private translateService = inject(TranslateService);

  navItems: NavItem[] = [
    { id: 'home', icon: 'home', labelKey: 'nav.map', route: '/' },
    { id: 'mountain', icon: 'map-pin', labelKey: 'nav.mountain', route: '/detail' },
    { id: 'stats', icon: 'bar-chart-3', labelKey: 'nav.stats', route: '/stats' },
  ];

  router = inject(Router);
  currentLang = this.translateService.lang;

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  activePage = computed(() => {
    const url = this.currentUrl();
    const matchedItem = this.navItems.find(
      item => item.route !== '/' && url.startsWith(item.route)
    );
    return matchedItem?.id ?? 'home';
  });

  navigate(pageId: NavItem['id']): void {
    const route = this.navItems.find(item => item.id === pageId)?.route;
    if (route) {
      this.router.navigate([route]);
    }
  }

  setLanguage(lang: Language): void {
    this.translateService.setLanguage(lang);
  }
}
