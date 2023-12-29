import React from 'react';
import '@/plugins/dayjs';
import { serviceWorker } from '@/services/service-worker';

export default async function bootstrap(
  _: React.ComponentType,
  innerBootStrap: () => void,
) {
  innerBootStrap();

  serviceWorker.register();
}
