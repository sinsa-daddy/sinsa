import {
  AssetType,
  CopilotNextSchema,
  CopilotSourceType,
  UNKNOWN_AUTHOR_ID,
  CopilotUserProviderType,
} from '@sinsa/schema';
import type { CopilotNextType } from '@sinsa/schema';
import {
  LegacyEnNameMapper,
  type FeishuLegacyCopilotItemType,
} from '../schema/feishu-legacy-copilot';
import { getContentFromFeishuSingleTextField } from './get-content-from-single-text-field';
import { toSlug } from '@/services/slug';

const POSITION_ARRAY = ['1', '2', '3', '4', '5'] as const;

export function toCopilotFromLegacy(
  item: FeishuLegacyCopilotItemType,
  getAid?: (enName: string) => string,
): CopilotNextType {
  const { fields } = item;
  const val: CopilotNextType = {
    copilot_id: toSlug(fields.bv.replaceAll(/[?]/g, ' ')),
    source_type: CopilotSourceType.Bilibili,
    href: fields.bv,
    term_id: `cn-${getContentFromFeishuSingleTextField(fields.term)}`,
    title: fields.title,
    score: fields.score,
    author_id: UNKNOWN_AUTHOR_ID,
    author_name: fields.author,
    description: fields.description,
    upload_time: fields.upload_time,
    created_by: {
      user_id: item.created_by.id,
      provider_type: CopilotUserProviderType.Feishu,
      name: item.created_by.name,
    },
    created_time: item.created_time,
    last_modified_by: {
      user_id: item.last_modified_by.id,
      provider_type: CopilotUserProviderType.Feishu,
      name: item.last_modified_by.name,
    },
    last_modified_time: item.last_modified_time,
    aurorian_requirements: POSITION_ARRAY.map(position => {
      const enName = getContentFromFeishuSingleTextField(
        fields[`aurorian_${position}`],
      );
      const finalEnName = LegacyEnNameMapper[enName] ?? enName;
      return {
        aurorian_id: getAid?.(finalEnName) ?? enName,
        breakthrough: fields[`aurorian_${position}_breakthrough`],
        remark: fields.replaceable_position?.includes(position)
          ? {
              replace: { type: 'any', any: 'All' },
            }
          : undefined,
      };
    }) as CopilotNextType['aurorian_requirements'],
    assets:
      fields.asset_type === AssetType.No33Scripts && fields.asset_link
        ? [
            {
              type: 'script33',
              script33: {
                link: fields.asset_link,
              },
            },
          ]
        : undefined,
  };

  return CopilotNextSchema.parse(val);
}
