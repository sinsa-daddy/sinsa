import type { CopilotNextType } from '@sinsa/schema';
import {
  FeishuCopilotSchema,
  type FeishuCopilotType,
} from '../schema/feishu-copilot';

export function toFeishuCopilot(c: CopilotNextType): FeishuCopilotType {
  const val: Record<keyof FeishuCopilotType, unknown> = {
    ...c,
    aurorian_1_id: c.aurorian_requirements[0].aurorian_id,
    aurorian_1_breakthrough: c.aurorian_requirements[0].breakthrough,
    aurorian_1_remark: c.aurorian_requirements[0].remark,
    aurorian_2_id: c.aurorian_requirements[1].aurorian_id,
    aurorian_2_breakthrough: c.aurorian_requirements[1].breakthrough,
    aurorian_2_remark: c.aurorian_requirements[1].remark,
    aurorian_3_id: c.aurorian_requirements[2].aurorian_id,
    aurorian_3_breakthrough: c.aurorian_requirements[2].breakthrough,
    aurorian_3_remark: c.aurorian_requirements[2].remark,
    aurorian_4_id: c.aurorian_requirements[3].aurorian_id,
    aurorian_4_breakthrough: c.aurorian_requirements[3].breakthrough,
    aurorian_4_remark: c.aurorian_requirements[3].remark,
    aurorian_5_id: c.aurorian_requirements[4].aurorian_id,
    aurorian_5_breakthrough: c.aurorian_requirements[4].breakthrough,
    aurorian_5_remark: c.aurorian_requirements[4].remark,
    description: c.description,
    assets: c.assets,
  };
  return FeishuCopilotSchema.parse(val);
}
