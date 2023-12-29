import { RoutePath } from '@/views/GlobalLayout/constants';

export function redirectToUploadPageWhenGettingCode() {
  const currentURL = new URL(window.location.href);
  if (
    currentURL.searchParams.has('code') &&
    currentURL.searchParams.has('state')
  ) {
    window.location.href = `${window.location.origin}/#${RoutePath.Upload}${currentURL.search}`;
  }
}
