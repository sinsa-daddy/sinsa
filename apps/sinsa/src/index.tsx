import type React from 'react';
import '@/plugins/dayjs';
import { applyApmPlus } from './plugins/apm';
import { serviceWorker } from '@/services/service-worker';
import '@icon-park/react/styles/index.less';

export default async function bootstrap(
  _: React.ComponentType,
  innerBootStrap: () => void,
) {
  applyApmPlus();
  innerBootStrap();
  serviceWorker.register();
}
