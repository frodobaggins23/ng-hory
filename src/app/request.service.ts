import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService, TokenType } from './token.service';

export interface RequestConfig {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  headers?: Record<string, string>;
  doNotAuthorize?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private httpClient = inject(HttpClient);
  private tokenService = inject(TokenService);

  private tokenType: TokenType = 'GALLERY_TOKEN'; // TODO: Make this configurable if needed

  request(config: RequestConfig & { responseType: 'blob' }): Observable<Blob>;
  request(config: RequestConfig & { responseType: 'text' }): Observable<string>;
  request(config: RequestConfig & { responseType: 'arraybuffer' }): Observable<ArrayBuffer>;
  request(config: RequestConfig & { responseType?: 'json' }): Observable<unknown>;
  request(config: RequestConfig): Observable<Blob | string | ArrayBuffer | unknown> {
    const {
      method,
      path,
      payload,
      headers = {},
      doNotAuthorize = false,
      responseType = 'json',
    } = config;

    // Build headers
    let requestHeaders = new HttpHeaders(headers);

    // Add authorization header if not disabled
    if (!doNotAuthorize) {
      const token = this.getAuthToken();
      if (token) {
        requestHeaders = requestHeaders.set('Authorization', token);
      }
    }

    // Disable HTTP caching to prevent browser cache
    requestHeaders = requestHeaders
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

  /**
   * Retrieve authorization token from localStorage
   */
  private getAuthToken(): string {
    const token = this.tokenService.getToken(this.tokenType);
    return `Bearer ${token || 'missing-token'}`;
  }
}
