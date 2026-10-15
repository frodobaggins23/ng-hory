import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RequestService } from './request.service';

describe('RequestService', () => {
  let service: RequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestService],
    });
    service = TestBed.inject(RequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should send a GET request', () => {
      service
        .request({
          method: 'get',
          path: '/api/data',
        })
        .subscribe();

      const req = httpMock.expectOne('/api/data');
      expect(req.request.method).toBe('GET');

      req.flush({});
    });

    it('should include custom headers in request', () => {
      service
        .request({
          method: 'get',
          path: '/api/data',
          headers: { 'X-Custom-Header': 'custom-value' },
        })
        .subscribe();

      const req = httpMock.expectOne('/api/data');
      expect(req.request.headers.get('X-Custom-Header')).toBe('custom-value');

      req.flush({});
    });

    it('should handle blob response type', () => {
      service
        .request({
          method: 'get',
          path: '/api/image',
          responseType: 'blob',
        })
        .subscribe((blob: Blob) => {
          expect(blob instanceof Blob).toBe(true);
        });

      const req = httpMock.expectOne('/api/image');
      expect(req.request.responseType).toBe('blob');

      req.flush(new Blob());
    });

    it('should handle text response type', () => {
      service
        .request({
          method: 'get',
          path: '/api/text',
          responseType: 'text',
        })
        .subscribe((text: string) => {
          expect(typeof text).toBe('string');
        });

      const req = httpMock.expectOne('/api/text');
      expect(req.request.responseType).toBe('text');

      req.flush('text content');
    });

    it('should handle arraybuffer response type', () => {
      service
        .request({
          method: 'get',
          path: '/api/binary',
          responseType: 'arraybuffer',
        })
        .subscribe((buffer: ArrayBuffer) => {
          expect(buffer instanceof ArrayBuffer).toBe(true);
        });

      const req = httpMock.expectOne('/api/binary');
      expect(req.request.responseType).toBe('arraybuffer');

      req.flush(new ArrayBuffer(0));
    });
  });

  describe('POST requests', () => {
    it('should send POST request with payload', () => {
      const payload = { name: 'John', age: 30 };

      service
        .request({
          method: 'post',
          path: '/api/users',
          payload,
        })
        .subscribe();

      const req = httpMock.expectOne('/api/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);

      req.flush({});
    });
  });

  describe('PUT requests', () => {
    it('should send PUT request with payload', () => {
      const payload = { name: 'Jane' };

      service
        .request({
          method: 'put',
          path: '/api/users/1',
          payload,
        })
        .subscribe();

      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);

      req.flush({});
    });
  });

  describe('DELETE requests', () => {
    it('should send DELETE request', () => {
      service
        .request({
          method: 'delete',
          path: '/api/users/1',
        })
        .subscribe();

      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe('DELETE');

      req.flush({});
    });
  });

  describe('PATCH requests', () => {
    it('should send PATCH request with payload', () => {
      const payload = { status: 'active' };

      service
        .request({
          method: 'patch',
          path: '/api/users/1',
          payload,
        })
        .subscribe();

      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(payload);

      req.flush({});
    });
  });

  describe('Error handling', () => {
    it('should throw error for unsupported HTTP method', () => {
      expect(() => {
        service
          .request({
            method: 'invalid' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            path: '/api/data',
          })
          .subscribe();
      }).toThrow();
    });
  });
});
