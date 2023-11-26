import type { Route } from '@ant-design/pro-layout/es/typing';
import { ReactComponent as IconHome } from './assets/icon-home.svg';
import { ReactComponent as IconLog } from './assets/icon-log.svg';

export const RoutePath = {
  Home: '/',
  Copilots: (term: string | number = ':term') => `/copilots/${term}`,
} as const;

export const MY_ROUTE: Route = {
  routes: [
    {
      path: RoutePath.Home,
      name: '首页',
      icon: <IconHome />,
    },
    {
      path: RoutePath.Copilots(),
      name: '荒典作业',
      icon: <IconLog />,
    },
  ],
};
