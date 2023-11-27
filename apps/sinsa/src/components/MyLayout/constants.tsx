import type { Route } from '@ant-design/pro-layout/es/typing';
import { ReactComponent as IconHome } from './assets/icon-home.svg';
import { ReactComponent as IconLog } from './assets/icon-log.svg';
import { ReactComponent as Icon33 } from './assets/icon-33.svg';

export const RoutePath = {
  Home: '/',
  Copilots: (term: string | number = ':term') => `/copilots/${term}`,
  Number33: '/number33',
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
    {
      path: RoutePath.Number33,
      name: '33号步骤图生成',
      icon: <Icon33 />,
    },
  ],
};
