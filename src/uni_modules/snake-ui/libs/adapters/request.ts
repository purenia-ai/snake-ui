import { requireSnakeRequest } from '../runtime';

export function createRequestClient(component: string) {
  return {
    get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
      return requireSnakeRequest(component).get<T>(url, params);
    },
    post<T = unknown>(url: string, data?: Record<string, unknown>): Promise<T> {
      return requireSnakeRequest(component).post<T>(url, data);
    },
  };
}
