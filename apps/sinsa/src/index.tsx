import type React from 'react';
import '@/plugins/dayjs';
import { redirectToUploadPageWhenGettingCode } from '@/services/feishu-oauth';
import { serviceWorker } from '@/services/service-worker';

export default async function bootstrap(
  _: React.ComponentType,
  innerBootStrap: () => void,
) {
  innerBootStrap();

  serviceWorker.register();
  redirectToUploadPageWhenGettingCode();
}
