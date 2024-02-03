import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { first } from 'lodash';

export function getContentFromRichText(val: RichTextItemResponse[]) {
  const firstItem = first(val);
  if (firstItem?.type === 'text') {
    return firstItem.text.content;
  }
  return undefined;
}
