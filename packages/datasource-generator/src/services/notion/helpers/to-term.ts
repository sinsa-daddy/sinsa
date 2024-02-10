import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { TermNextType } from '@sinsa/schema';
import { TermNextSchema } from '@sinsa/schema';
import { getContentFromRichText, getContentFromSelect } from './get-content';

export function toTerm(page: PageObjectResponse): TermNextType {
  const { properties } = page;
  if (
    properties.term_id?.type === 'title' &&
    properties.order?.type === 'number' &&
    properties.boss_name?.type === 'rich_text' &&
    properties.boss_element?.type === 'select' &&
    properties.period?.type === 'date' &&
    properties.features?.type === 'rich_text' &&
    properties.reruns?.type === 'multi_select'
  ) {
    const rerunsArray = properties.reruns.multi_select.map(s => s.name);
    const val: Record<keyof TermNextType, unknown> = {
      term_id: getContentFromRichText(properties.term_id.title),
      order: properties.order.number,
      boss_name: getContentFromRichText(properties.boss_name.rich_text),
      boss_element: getContentFromSelect(properties.boss_element.select),
      start_time: properties.period.date?.start,
      end_time: properties.period.date?.end,
      features: getContentFromRichText(properties.features.rich_text),
      reruns: rerunsArray.length ? rerunsArray : undefined,
    };

    return TermNextSchema.parse(val);
  }

  throw new Error(`Cannot parse: ${page.url}`);
}
