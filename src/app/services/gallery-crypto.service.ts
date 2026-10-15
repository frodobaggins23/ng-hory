import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RequestService } from '../request.service';
import { TokenService } from '../token.service';
import {
  GALLERY_CANARY_PATH,
  GALLERY_CANARY_PLAINTEXT,
  GALLERY_CRYPTO,
} from '../gallery-crypto.constants';

function bytesToBase64(bytes: Uint8Array<ArrayBuffer>): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

@Injectable({
  providedIn: 'root',
})
export class GalleryCryptoService {
  private requestService = inject(RequestService);
  private tokenService = inject(TokenService);

  isUnlocked = signal(false);

  private cachedKey: CryptoKey | null = null;

  /**
   * Re-derives trust from whatever key material is already in localStorage
   * (set by a previous unlock()). Verifies it against the canary so a
   * passphrase rotation or corrupted storage falls back to locked instead
   * of throwing on the first real image.
   */
  async restoreFromStorage(): Promise<void> {
    const stored = this.tokenService.getToken('GALLERY_TOKEN');
    if (!stored) {
      this.isUnlocked.set(false);
      return;
    }

    try {
      const key = await crypto.subtle.importKey('raw', base64ToBytes(stored), 'AES-GCM', true, [
        'decrypt',
      ]);
      await this.verifyKey(key);
      this.cachedKey = key;
      this.isUnlocked.set(true);
    } catch {
      this.lock();
    }
  }

  async unlock(passphrase: string): Promise<boolean> {
    try {
      const key = await this.deriveKey(passphrase);
      await this.verifyKey(key);

      const raw = await crypto.subtle.exportKey('raw', key);
      this.tokenService.saveToken('GALLERY_TOKEN', bytesToBase64(new Uint8Array(raw)));
      this.cachedKey = key;
      this.isUnlocked.set(true);
      return true;
    } catch {
      this.cachedKey = null;
      this.isUnlocked.set(false);
      return false;
    }
  }

  lock(): void {
    this.cachedKey = null;
    this.tokenService.removeToken('GALLERY_TOKEN');
    this.isUnlocked.set(false);
  }

  async decryptToBlob(buffer: ArrayBuffer, mimeType: string): Promise<Blob> {
    if (!this.cachedKey) {
      throw new Error('Gallery is locked');
    }
    const plaintext = await this.decryptBuffer(this.cachedKey, buffer);
    return new Blob([plaintext], { type: mimeType });
  }

  private async decryptBuffer(key: CryptoKey, buffer: ArrayBuffer): Promise<ArrayBuffer> {
    const bytes = new Uint8Array(buffer);
    const iv = bytes.slice(0, GALLERY_CRYPTO.ivLength);
    const ciphertext = bytes.slice(GALLERY_CRYPTO.ivLength);
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  }

  private async verifyKey(key: CryptoKey): Promise<void> {
    const buffer = await firstValueFrom(
      this.requestService.request({
        method: 'get',
        path: GALLERY_CANARY_PATH,
        responseType: 'arraybuffer',
      })
    );
    const plaintext = await this.decryptBuffer(key, buffer);
    if (new TextDecoder().decode(plaintext) !== GALLERY_CANARY_PLAINTEXT) {
      throw new Error('Passphrase verification failed');
    }
  }

  private async deriveKey(passphrase: string): Promise<CryptoKey> {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: GALLERY_CRYPTO.salt,
        iterations: GALLERY_CRYPTO.iterations,
        hash: GALLERY_CRYPTO.hash,
      },
      baseKey,
      { name: 'AES-GCM', length: GALLERY_CRYPTO.keyLength },
      true,
      ['encrypt', 'decrypt']
    );
  }
}
