import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavService } from '../../nav.service';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../icon.service';

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
export class NavComponent implements OnInit, OnDestroy {
  activePage: 'home' | 'mountain' | 'stats' = 'home';

  navItems: NavItem[] = [
    { id: 'home', icon: 'home', label: 'Mapa', route: '/home' },
    { id: 'mountain', icon: 'map-pin', label: 'Hora', route: '/mountain' },
    { id: 'stats', icon: 'bar-chart-3', label: 'Statistiky', route: '/stats' },
  ];

  navService = inject(NavService);
  router = inject(Router);

  private subscription?: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.subscription = this.navService.activePage$.subscribe(page => {
      this.activePage = page;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  navigate(pageId: NavItem['id'], route: string): void {
    this.navService.setActivePage(pageId);
    this.router.navigate([route]);
  }
}
