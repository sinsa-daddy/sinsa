import type React from 'react';
import '@/plugins/dayjs';
import { serviceWorker } from '@/services/service-worker';
import '@icon-park/react/styles/index.less';
import './plugins/aegis';

export default async function bootstrap(
  _: React.ComponentType,
  innerBootStrap: () => void,
) {
  innerBootStrap();
  serviceWorker.register();
}
