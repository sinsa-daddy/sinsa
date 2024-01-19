import { EmotionHappy, Home, Search, ViewList } from '@icon-park/react';

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
      icon: <Home size={16} />,
    },
    {
      path: RoutePath.Solutions(),
      name: '作业匹配',
      icon: <Search size={16} />,
      requireLatestTerm: true,
    },
    {
      path: RoutePath.Copilots(),
      name: '作业全览',
      icon: <ViewList size={16} />,
      requireLatestTerm: true,
    },
    {
      path: RoutePath.Questions,
      name: '反馈建议',
      icon: <EmotionHappy size={16} />,
      link: true,
    },
  ],
};
