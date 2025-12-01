import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private activePageSubject = new BehaviorSubject<'home' | 'mountain' | 'stats'>('home');
  public activePage$ = this.activePageSubject.asObservable();

  setActivePage(page: 'home' | 'mountain' | 'stats'): void {
    this.activePageSubject.next(page);
  }

  getActivePage(): 'home' | 'mountain' | 'stats' {
    return this.activePageSubject.value;
  }
}
