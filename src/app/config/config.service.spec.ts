import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    service = TestBed.inject(ConfigService);
    expect(service).toBeTruthy();
  });

  it('should return config when valid', () => {
    service = TestBed.inject(ConfigService);
    const config = service.getConfig();
    expect(config).toBeDefined();
    expect(config.production).toBeDefined();
    expect(config.imageCache).toBeDefined();
  });

  it('should provide mapApiKey', () => {
    service = TestBed.inject(ConfigService);
    const key = service.getMapApiKey();
    expect(typeof key).toBe('string');
  });

  it('should provide fileServerHost', () => {
    service = TestBed.inject(ConfigService);
    const host = service.getFileServerHost();
    expect(typeof host).toBe('string');
  });

  it('should build API URLs correctly', () => {
    service = TestBed.inject(ConfigService);
    const url = service.buildApiUrl('verify-token');
    expect(url).toContain('/api/verify-token');
  });

  it('should provide image cache config', () => {
    service = TestBed.inject(ConfigService);
    const config = service.getImageCacheConfig();
    expect(config.maxImages).toBeGreaterThan(0);
    expect(config.maxSizePerImage).toBeGreaterThan(0);
    expect(config.maxTotalSize).toBeGreaterThan(0);
  });

  it('should indicate production status', () => {
    service = TestBed.inject(ConfigService);
    expect(typeof service.isProduction()).toBe('boolean');
  });
});
