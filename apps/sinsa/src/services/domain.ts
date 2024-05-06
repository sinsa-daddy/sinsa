export type DomainType = 'main' | 'backup' | 'localhost';

export const DOMAIN: DomainType =
  // eslint-disable-next-line no-nested-ternary
  window.location.hostname === 'sinsa-daddy.com' ||
  window.location.hostname === 'sinsa.dad'
    ? 'main'
    : window.location.hostname ===
      'sinsa-daddy-webify-4dvq4ad5366bb-1255364977.tcloudbaseapp.com'
    ? 'backup'
    : 'localhost';

export const DomainText: Record<DomainType, string> = {
  backup: '腾讯云备用临时站点（之后可能下线）',
  localhost: '开发站点',
  main: '首发站点',
};
