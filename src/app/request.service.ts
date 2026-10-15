import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RequestConfig {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  headers?: Record<string, string>;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private httpClient = inject(HttpClient);

  request(config: RequestConfig & { responseType: 'blob' }): Observable<Blob>;
  request(config: RequestConfig & { responseType: 'text' }): Observable<string>;
  request(config: RequestConfig & { responseType: 'arraybuffer' }): Observable<ArrayBuffer>;
  request(config: RequestConfig & { responseType: 'json' }): Observable<unknown>;
  request(config: RequestConfig): Observable<Blob | string | ArrayBuffer | unknown>;
  request(config: RequestConfig): Observable<Blob | string | ArrayBuffer | unknown> {
    const { method, path, payload, headers = {}, responseType = 'json' } = config;

    // Disable HTTP caching to prevent browser cache
    const requestHeaders = new HttpHeaders(headers)
      .set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('Expires', '0');

    const options = {
      headers: requestHeaders,
      responseType: responseType as never,
    };

    // Make the request based on method
    switch (method.toLowerCase()) {
      case 'get':
        return this.httpClient.get(path, options);
      case 'post':
        return this.httpClient.post(path, payload, options);
      case 'put':
        return this.httpClient.put(path, payload, options);
      case 'delete':
        return this.httpClient.delete(path, options);
      case 'patch':
        return this.httpClient.patch(path, payload, options);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
