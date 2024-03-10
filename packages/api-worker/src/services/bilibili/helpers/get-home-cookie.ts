import { USER_AGENT } from '../constants';

export async function getHomeCookie() {
  try {
    const homeResponse = await fetch(
      `https://www.bilibili.com?t=${Date.now()}`,
      {
        headers: {
          'User-Agent': USER_AGENT,
        },
      },
    );

    return homeResponse.headers.getSetCookie();
  } catch (error) {}
  return null;
}
