export const UPLOAD_APP_ID = 'cli_a5fd9725777a100b';

export const LARK_SCOPE = `bitable:app`;

export const LARK_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'http://8.134.125.149/api'
    : 'http://localhost:3000';
