export type DomainType = 'main' | 'backup' | 'localhost';

export const DOMAIN: DomainType =
  // eslint-disable-next-line no-nested-ternary
  window.location.hostname === 'sinsa-daddy.com' ||
  window.location.hostname === 'sinsa.dad'
    ? 'main'
    : window.location.hostname ===
      'sinsa.top'
    ? 'backup'
    : 'localhost';

export const DomainText: Record<DomainType, string> = {
  backup: '腾讯云备用临时站点（中国大陆地区自动跳转, 之后可能下线）',
  localhost: '开发站点',
  main: '首发站点',
};
