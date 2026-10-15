// Fixed, non-secret PBKDF2/AES-GCM parameters shared between the build-time
// encrypt script (scripts/encrypt-gallery.ts, run with Node's webcrypto) and
// the browser decrypt path (gallery-crypto.service.ts). None of this needs
// to be secret - only the passphrase typed by visitors does.
export const GALLERY_CRYPTO = {
  salt: new Uint8Array([
    0x87, 0xba, 0x67, 0x35, 0x9a, 0x12, 0xa2, 0x0b, 0xde, 0x66, 0x6e, 0x8c, 0x04, 0xb8, 0xa2, 0x42,
  ]),
  iterations: 600_000,
  hash: 'SHA-256' as const,
  keyLength: 256,
  ivLength: 12,
};

export const GALLERY_CANARY_PATH = './assets/gallery/canary.enc';
export const GALLERY_CANARY_PLAINTEXT = 'ng-hory-gallery-ok';
