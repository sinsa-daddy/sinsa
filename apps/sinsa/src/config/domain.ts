export type DomainKey = 'cn' | 'i18n' | 'local' | 'backup' | 'unknown';

export const DOMAIN_ORIGIN: Record<DomainKey, string> = {
  cn: 'sinsa.top',
  i18n: 'sinsa.dad',
  local: 'localhost:8080',
  backup: 'sinsa-daddy.com',
  unknown: '',
};

export const DOMAIN_TEXT: Record<DomainKey, string> = {
  cn: '国内站点',
  i18n: '国际站点',
  local: '本地开发站点',
  backup: '备用站点',
  unknown: '未知站点',
};

export const DOMAIN_KEYS = Object.keys(DOMAIN_ORIGIN);

export const DOMAIN_VALUES = Object.values(DOMAIN_ORIGIN);

export function getCurrentDomainKey(): DomainKey {
  const currentHost = window.location.host;

  switch (currentHost) {
    case DOMAIN_ORIGIN.cn:
      return 'cn';
    case DOMAIN_ORIGIN.i18n:
      return 'i18n';
    case DOMAIN_ORIGIN.backup:
      return 'backup';
    case DOMAIN_ORIGIN.local:
      return 'local';
    default:
      return 'unknown';
  }
}
