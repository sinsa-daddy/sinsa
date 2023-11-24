import type { Route } from '@ant-design/pro-layout/es/typing';
import { ReactComponent as IconHome } from './assets/icon-home.svg';
import { ReactComponent as IconLog } from './assets/icon-log.svg';

export const MY_ROUTE: Route = {
  routes: [
    {
      path: '/',
      name: '首页',
      icon: <IconHome />,
    },
    {
      path: '/copilot',
      name: '作业',
      icon: <IconLog />,
    },
  ],
};
