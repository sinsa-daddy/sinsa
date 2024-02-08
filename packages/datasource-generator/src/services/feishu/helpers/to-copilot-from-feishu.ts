import { CopilotNextSchema } from '@sinsa/schema';
import type { AurorianRequirementType, CopilotNextType } from '@sinsa/schema';
import type { FeishuCopilotType } from '../schema/feishu-copilot';

export function toCopilotFromFeishu(f: FeishuCopilotType): CopilotNextType {
  const val: Record<keyof CopilotNextType, unknown> = {
    copilot_id: f.copilot_id,
    source_type: f.source_type,
    href: f.href,
    term_id: f.term_id,
    title: f.title,
    score: f.score,
    author_id: f.author_id,
    author_name: f.author_name,
    description: f.description,
    upload_time: f.upload_time,
    created_by: JSON.parse(f.created_by),
    created_time: f.created_time,
    aurorian_requirements: [
      {
        aurorian_id: f.aurorian_1_id,
        breakthrough: f.aurorian_1_breakthrough,
        remark: f.aurorian_1_remark
          ? JSON.parse(f.aurorian_1_remark)
          : undefined,
      },
      {
        aurorian_id: f.aurorian_2_id,
        breakthrough: f.aurorian_2_breakthrough,
        remark: f.aurorian_2_remark
          ? JSON.parse(f.aurorian_2_remark)
          : undefined,
      },
      {
        aurorian_id: f.aurorian_3_id,
        breakthrough: f.aurorian_3_breakthrough,
        remark: f.aurorian_3_remark
          ? JSON.parse(f.aurorian_3_remark)
          : undefined,
      },
      {
        aurorian_id: f.aurorian_4_id,
        breakthrough: f.aurorian_4_breakthrough,
        remark: f.aurorian_4_remark
          ? JSON.parse(f.aurorian_4_remark)
          : undefined,
      },
      {
        aurorian_id: f.aurorian_5_id,
        breakthrough: f.aurorian_5_breakthrough,
        remark: f.aurorian_5_remark
          ? JSON.parse(f.aurorian_5_remark)
          : undefined,
      },
    ] as AurorianRequirementType[],
    assets: f.assets ? JSON.parse(f.assets) : undefined,
  };
  return CopilotNextSchema.parse(val);
}
