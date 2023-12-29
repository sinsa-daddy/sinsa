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
