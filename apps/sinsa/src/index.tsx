import type React from 'react';
import '@/plugins/dayjs';
import { serviceWorker } from '@/services/service-worker';
import '@icon-park/react/styles/index.less';

export default async function bootstrap(
  _: React.ComponentType,
  innerBootStrap: () => void,
) {
  innerBootStrap();
  serviceWorker.register();

  // APM
  import('./plugins/arms').then(({ initArmsRum }) => {
    initArmsRum();
  });
}
