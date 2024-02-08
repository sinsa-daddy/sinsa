import type { FeishuSingleReferenceTextType } from '../schema/feishu-fields';

export function getContentFromFeishuSingleTextField(
  field: FeishuSingleReferenceTextType,
) {
  return field[0].text_arr[0];
}
