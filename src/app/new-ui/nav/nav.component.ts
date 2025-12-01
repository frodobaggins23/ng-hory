import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavService } from '../../nav.service';

interface NavItem {
  id: 'home' | 'mountain' | 'stats';
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NavComponent implements OnInit {
  activePage: 'home' | 'mountain' | 'stats' = 'home';

  navItems: NavItem[] = [
    { id: 'home', icon: 'home', label: 'Mapa', route: '/home' },
    { id: 'mountain', icon: 'map-pin', label: 'Hora', route: '/mountain' },
    { id: 'stats', icon: 'bar-chart-3', label: 'Statistiky', route: '/stats' },
  ];

  public navService = inject(NavService);
  public router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.navService.activePage$.subscribe(page => {
      this.activePage = page;
    });
  }

  navigate(pageId: NavItem['id'], route: string): void {
    this.navService.setActivePage(pageId);
    this.router.navigate([route]);
  }

  getIcon(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22v-10h6v10',
      'map-pin':
        'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
      'bar-chart-3': 'M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3',
      mountain: 'm8 3 4 8 5-5 5 15H2L8 3z',
    };
    return iconMap[iconName] || '';
  }
}
