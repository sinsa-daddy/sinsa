import { TermSchema, TermType } from '@sinsa/schema';
import { useEffect, useState } from 'react';
import { isCurrentlyUnderway } from '@/models/terms';

declare global {
  interface Window {
    __TERMS_UPDATE_PROMISE__?: Promise<{
      cacheName: string;
      updatedURL: string;
      terms: unknown[];
    }>;
  }
}

export class ServiceWorkerService {
  static SERVICE_WORKER_URL: string = '/sw.js';

  private static instance: ServiceWorkerService | null = null;

  public static getInstance(): ServiceWorkerService {
    if (ServiceWorkerService.instance === null) {
      ServiceWorkerService.instance = new ServiceWorkerService();
    }
    return ServiceWorkerService.instance;
  }

  protected constructor() {
    // noop
  }

  /**
   * 注册 Service Worker
   */
  async register() {
    if (
      'serviceWorker' in window.navigator &&
      window.location.host !== 'localhost:8080'
    ) {
      const { Workbox } = await import(
        /* webpackChunkName: "lib-workbox-window" */ 'workbox-window'
      );

      const wb = new Workbox(ServiceWorkerService.SERVICE_WORKER_URL);

      window.__TERMS_UPDATE_PROMISE__ = new Promise(resolve => {
        wb.addEventListener('message', event => {
          if (event.data.type === 'TERMS_UPDATE') {
            resolve(event.data.payload);
          }
        });

        wb.register();
      });
    } else {
      console.log('[ServiceWorkerService] Cannot register service worker.');
    }
  }
}

export const serviceWorker = ServiceWorkerService.getInstance();

export function useActualLatestTerm() {
  const [actualLatestTerm, setActualLatestTerm] = useState<TermType>();

  useEffect(() => {
    const run = async () => {
      if (window.__TERMS_UPDATE_PROMISE__ instanceof Promise) {
        const payload = await window.__TERMS_UPDATE_PROMISE__;

        if (Array.isArray(payload?.terms)) {
          const actualLatestTerm = payload.terms
            .map(mayBeTerm => TermSchema.parse(mayBeTerm))
            .find(term => isCurrentlyUnderway(term));

          if (typeof actualLatestTerm?.term === 'number') {
            setActualLatestTerm(actualLatestTerm);
          }
        }
      }
    };

    run();
  }, []);

  return actualLatestTerm;
}
