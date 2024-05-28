import { SPALoadPlugin } from '@apmplus/integrations';
import type { BrowserClient } from '@apmplus/web';
import { getCurrentDomainKey } from '@/config/domain';

declare global {
  interface Window {
    browserClient: BrowserClient;
  }
}

export function applyApmPlus() {
  window.browserClient.init({
    aid: 609949,
    token: 'ea57d64cf1ef44ed9423215eadb7f5a2',

    // 其他配置
    env: window.location.host,
    release: `${__COMMIT_TIME__}_${__COMMIT_HASH__}`,

    plugins: {
      pageview: {
        routeMode: 'hash',
      },
      resource: false,
      blankScreen: {
        rootSelector: '#root',
      },
    },
    integrations: [SPALoadPlugin()],
  });

  if (getCurrentDomainKey() !== 'local') {
    window.browserClient.start();
  }
}
