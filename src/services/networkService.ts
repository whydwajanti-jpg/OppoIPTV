import axios, { AxiosInstance, AxiosError } from 'axios';
import type { PlaybackError } from '@types/index';

export class NetworkService {
  private client: AxiosInstance;
  private requestTimeout = 30000;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.client = axios.create({
      timeout: this.requestTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for retry logic
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  async get<T>(url: string, options?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.get<T>(url, options);
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  async post<T>(url: string, data?: any, options?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, options);
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  async withRetry<T>(
    fn: () => Promise<T>,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && this.isRetryable(error)) {
        await this.delay(this.retryDelay);
        return this.withRetry(fn, retries - 1);
      }
      throw error;
    }
  }

  private isRetryable(error: any): boolean {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      return (
        !status || // Network error
        status === 408 || // Request Timeout
        status === 429 || // Too Many Requests
        (status >= 500 && status < 600) // Server errors
      );
    }
    return false;
  }

  private async handleError(error: AxiosError): Promise<never> {
    throw error;
  }

  private parseError(error: any): PlaybackError {
    if (error instanceof AxiosError) {
      if (!error.response) {
        return {
          code: 'NETWORK_ERROR',
          domain: 'NETWORK',
          message: 'Network connection failed',
          recoveryAction: 'Check network connection and retry',
        };
      }

      const status = error.response.status;
      if (status === 401 || status === 403) {
        return {
          code: 'AUTH_FAILED',
          domain: 'AUTHENTICATION',
          message: 'Authentication failed',
          recoveryAction: 'Check provider credentials',
        };
      }

      return {
        code: `HTTP_${status}`,
        domain: status >= 500 ? 'PROVIDER' : 'NETWORK',
        message: `HTTP Error ${status}`,
        recoveryAction: 'Retry the request',
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      domain: 'UNKNOWN',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setRequestTimeout(ms: number): void {
    this.requestTimeout = ms;
    this.client.defaults.timeout = ms;
  }

  setMaxRetries(max: number): void {
    this.maxRetries = max;
  }
}

export const networkService = new NetworkService();
