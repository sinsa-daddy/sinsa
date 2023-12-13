import { ReactComponent as IconHome } from './assets/icon-home.svg';
import { ReactComponent as IconLog } from './assets/icon-log.svg';
import { ReactComponent as IconSolution } from './assets/icon-solution.svg';
// import { ReactComponent as Icon33 } from './assets/icon-33.svg';

export const RoutePath = {
  Home: '/',
  Solutions: (term: string | number = ':term') => `/solutions/${term}`,
  Copilots: (term: string | number = ':term') => `/copilots/${term}`,
  Number33: '/number33',
  MyBox: '/my-box',
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
    },
    {
      path: RoutePath.Copilots(),
      name: '作业全览',
      icon: <IconLog />,
    },
    // {
    //   path: RoutePath.MyBox,
    //   name: '我的 Box',
    //   icon: <IconLog />,
    // },
    // {
    //   path: RoutePath.Number33,
    //   name: '33号步骤图生成',
    //   icon: <Icon33 />,
    // },
  ],
};
