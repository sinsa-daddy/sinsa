import { USER_AGENT } from '../constants';

export async function getWBIKeys() {
  try {
    const navResponse = await fetch(
      'https://api.bilibili.com/x/web-interface/nav',
      {
        headers: {
          'user-agent': USER_AGENT,
          referer: 'https://www.bilibili.com',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language':
            'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en;q=0.3,en-US;q=0.2',
          Accept: 'application/json, text/plain, */*',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          Origin: 'https://www.bilibili.com',
          Pragma: 'no-cache',
        },
      },
    );

    const json = await navResponse.json<any>();

    console.log('json from /x/web-interface/nav', json);

    const imgURL = json?.data?.wbi_img?.img_url as string | undefined;
    const subURL = json?.data?.wbi_img?.sub_url as string | undefined;

    console.log('urls', imgURL, subURL);

    if (imgURL && subURL) {
      const imgKey: string = imgURL.slice(
        imgURL.lastIndexOf('/') + 1,
        imgURL.lastIndexOf('.'),
      );
      const subKey: string = subURL.slice(
        subURL.lastIndexOf('/') + 1,
        subURL.lastIndexOf('.'),
      );

      return { imgKey, subKey };
    }
  } catch (error) {}
  return undefined;
}
