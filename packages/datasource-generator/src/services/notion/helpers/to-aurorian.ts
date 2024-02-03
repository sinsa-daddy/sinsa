import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { AurorianNextType } from '@sinsa/schema';
import { AurorianNextSchema } from '@sinsa/schema';
import { getContentFromRichText, getContentFromSelect } from './get-content';

export function toAurorian(page: PageObjectResponse): AurorianNextType {
  const { properties } = page;
  if (
    properties.aurorian_id?.type === 'title' &&
    properties.name?.type === 'rich_text' &&
    properties.cn_name?.type === 'rich_text' &&
    properties.primary_element?.type === 'select' &&
    properties.secondary_element?.type === 'select' &&
    properties.profession?.type === 'select' &&
    properties.rarity?.type === 'number'
  ) {
    const val: Record<keyof AurorianNextType, unknown> = {
      aurorian_id: getContentFromRichText(properties.aurorian_id.title),
      name: getContentFromRichText(properties.name.rich_text),
      cn_name: getContentFromRichText(properties.cn_name.rich_text),
      primary_element: getContentFromSelect(properties.primary_element.select),
      secondary_element: getContentFromSelect(
        properties.secondary_element.select,
      ),
      profession: getContentFromSelect(properties.profession.select),
      rarity: properties.rarity.number,
    };

    return AurorianNextSchema.parse(val);
  }

  throw new Error(`Cannot parse: ${page.url}`);
}
