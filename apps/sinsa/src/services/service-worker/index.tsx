import { Typography, notification } from 'antd';

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

      wb.addEventListener('activated', event => {
        if (!event.isUpdate) {
          notification.success({
            message: `缓存完成, 作业站可以离线本地使用了`,
            duration: 3,
            placement: 'bottom',
          });
        } else {
          notification.success({
            message: (
              <span>
                缓存已更新, 刷新页面后生效{' '}
                <Typography.Link
                  onClick={e => {
                    e.stopPropagation();
                    window.location.reload();
                  }}
                >
                  立即刷新
                </Typography.Link>
              </span>
            ),
            duration: 3,
            placement: 'bottom',
          });
        }
      });

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
