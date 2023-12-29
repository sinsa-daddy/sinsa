import { ReactComponent as IconHome } from './assets/icon-home.svg';
import { ReactComponent as IconLog } from './assets/icon-log.svg';
import { ReactComponent as IconSolution } from './assets/icon-solution.svg';

export const RoutePath = {
  Home: '/',
  Solutions: (term: string | number = ':term') => `/solutions/${term}`,
  Copilots: (term: string | number = ':term') => `/copilots/${term}`,
  Upload: '/upload',
} as const;

export const MY_ROUTE = {
  routes: [
    {
      path: RoutePath.Home,
      name: '首页',
      icon: <IconHome />,
    },
    {
      path: RoutePath.Solutions(),
      name: '作业匹配',
      icon: <IconSolution />,
      requireLatestTerm: true,
    },
    {
      path: RoutePath.Copilots(),
      name: '作业全览',
      icon: <IconLog />,
      requireLatestTerm: true,
    },
  ],
};
