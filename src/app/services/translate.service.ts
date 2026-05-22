import { Injectable, signal } from '@angular/core';
import { cs } from '../i18n/cs';
import { en } from '../i18n/en';

export type Language = 'cs' | 'en';

const TRANSLATIONS: Record<Language, Record<string, string>> = { cs, en };
const STORAGE_KEY = 'ng-hory-lang';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private _lang = signal<Language>(this.loadSavedLanguage());
  readonly lang = this._lang.asReadonly();

  private loadSavedLanguage(): Language {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'en' ? 'en' : 'cs';
    } catch {
      return 'cs';
    }
  }

  setLanguage(lang: Language): void {
    this._lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage errors
    }
  }

  get(key: string, params?: Record<string, string | number>): string {
    const translations = TRANSLATIONS[this._lang()];
    let value = translations[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return value;
  }

  months(): string[] {
    return Array.from({ length: 12 }, (_, i) => this.get(`months.${i + 1}`));
  }
}
