export type DomainType = 'main' | 'backup' | 'localhost';

export const DOMAIN: DomainType =
  // eslint-disable-next-line no-nested-ternary
  window.location.hostname === 'sinsa-daddy.com'
    ? 'main'
    : window.location.hostname === 'sinsa-daddy.gitee.io'
    ? 'backup'
    : 'localhost';

export const DomainText: Record<DomainType, string> = {
  backup: '备用站点',
  localhost: '开发站点',
  main: '首发站点',
};
