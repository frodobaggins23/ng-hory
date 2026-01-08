import { Injectable } from '@angular/core';

enum TokenTypeEnum {
  GALLERY_TOKEN = 'gallery_token',
  OTHER = 'other', // expandable for future token types
}

export type TokenType = keyof typeof TokenTypeEnum;

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_PREFIX = 'app_auth_';

  constructor() {}

  saveToken(type: TokenType, token: string): void {
    const key = this.getStorageKey(type);
    localStorage.setItem(key, token);
  }

  getToken(type: TokenType): string | null {
    const key = this.getStorageKey(type);
    return localStorage.getItem(key);
  }

  removeToken(type: TokenType): void {
    const key = this.getStorageKey(type);
    localStorage.removeItem(key);
  }

  clearAllTokens(): void {
    Object.values(TokenTypeEnum).forEach(type => {
      this.removeToken(type as unknown as TokenType);
    });
  }

  private getStorageKey(type: TokenType): string {
    return `${this.TOKEN_PREFIX}${type}`;
  }
}
