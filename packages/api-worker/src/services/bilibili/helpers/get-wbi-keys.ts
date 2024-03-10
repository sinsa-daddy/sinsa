import { USER_AGENT } from '../constants';

export async function getWBIKeys() {
  try {
    const navResponse = await fetch(
      'https://api.bilibili.com/x/web-interface/nav',
      {
        headers: {
          'User-Agent': USER_AGENT,
        },
      },
    );

    const json = await navResponse.json<any>();

    const imgURL = json?.data?.wbi_img?.img_url as string | undefined;
    const subURL = json?.data?.wbi_img?.sub_url as string | undefined;

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
