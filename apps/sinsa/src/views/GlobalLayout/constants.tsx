import { ReactComponent as IconHome } from './assets/icon-home.svg';
import { ReactComponent as IconLog } from './assets/icon-log.svg';
import { ReactComponent as IconSolution } from './assets/icon-solution.svg';
import { ReactComponent as IconHappyFace } from './assets/icon-happy-face.svg';

export const RoutePath = {
  Home: '/',
  Solutions: (term: string | number = ':term') => `/solutions/${term}`,
  Copilots: (term: string | number = ':term') => `/copilots/${term}`,
  Upload: '/upload',
  Questions:
    'https://fwf92qm5h53.feishu.cn/share/base/form/shrcnkfhNUEP1AHIktUV6gRMFKc',
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
    {
      path: RoutePath.Questions,
      name: '反馈建议',
      icon: <IconHappyFace />,
      link: true,
    },
  ],
};
