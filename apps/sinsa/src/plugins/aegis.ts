import Aegis from 'aegis-web-sdk/lib/aegis.f.min';

const url = new URL(window.location.href);

export const aegis = new Aegis({
  id: 'gQm8nugn5Gmlx39Pvz', // 应用ID，即上报ID
  reportApiSpeed: true, // 接口测速
  reportAssetSpeed: true, // 静态资源测速
  hostUrl: 'https://rumt-zh.com', // 上报域名，中国大陆 rumt-zh.com
  spa: true, // spa 应用页面跳转的时候开启 pv 计算
  env:
    url.hostname === 'sinsa-daddy.com' ||
    url.hostname === 'sinsa-daddy.gitee.io'
      ? 'production'
      : 'local',
});

export enum AegisCustomEvent {
  QuerySolution = 'query_solution',
}

export enum AegisCustomTimeEvent {
  QuerySolutionTime = 'query_solution_time',
}
