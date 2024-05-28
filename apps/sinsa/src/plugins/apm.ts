import { SPALoadPlugin } from '@apmplus/integrations';
import type { BrowserClient } from '@apmplus/web';

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
    release: `${__COMMIT_HASH__}${__COMMIT_TIME__}`,

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

  window.browserClient.start();
}
