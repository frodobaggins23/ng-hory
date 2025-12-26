import { Component, inject, computed } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map, startWith } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../icon.service';
import { toSignal } from '@angular/core/rxjs-interop';

interface NavItem {
  id: 'home' | 'mountain' | 'stats';
  icon: IconName;
  label: string;
  route: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  standalone: true,
  imports: [CommonModule, IconComponent, IconComponent],
})
export class NavComponent {
  constructor() {}

  navItems: NavItem[] = [
    { id: 'home', icon: 'home', label: 'Mapa', route: '/new' },
    { id: 'mountain', icon: 'map-pin', label: 'Hora', route: '/new/detail' },
    { id: 'stats', icon: 'bar-chart-3', label: 'Statistiky', route: '/stats' },
  ];

  router = inject(Router);

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
    const matchedItem = this.navItems.find(item => url === item.route);
    return matchedItem?.id ?? 'home';
  });

  navigate(pageId: NavItem['id']): void {
    const route = this.navItems.find(item => item.id === pageId)?.route;
    if (route) {
      this.router.navigate([route]);
    }
  }
}
