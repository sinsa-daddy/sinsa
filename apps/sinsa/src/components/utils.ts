export function trimTitle(title: string): string {
  return title
    .replace('[白夜极光]', '')
    .replace('【白夜极光】', '')
    .replace('白夜极光', '')
    .replace('荒典', '')
    .replace('[hidden]', '');
}
