import {
  CopilotAurorianSummaryType,
  type CopilotType,
  type RemoteCopilotType,
} from '../schema/copilot';

const POSITION_ARRAY = ['1', '2', '3', '4', '5'] as const;

export function toCopilot(r: RemoteCopilotType): CopilotType {
  const rerurnTerms = r.rerun_terms[0].text_arr.map(termStr =>
    Number.parseInt(termStr, 10),
  );
  return {
    bv: r.bv,
    title: r.title,
    description: r.description,
    author: r.author,
    insert_db_time: r.insert_db_time,
    upload_time: r.upload_time,
    score: r.score,
    term: Number.parseInt(r.term[0].text_arr[0], 10),
    rerun_terms: rerurnTerms.length ? rerurnTerms : undefined,
    aurorian_summaries: POSITION_ARRAY.map(pos => {
      return {
        aurorian_name: r[`aurorian_${pos}`][0].text,
        breakthrough: r[`aurorian_${pos}_breakthrough`],
        is_replaceable: r.replaceable_position?.includes(pos) ?? false,
      };
    }) as [
      CopilotAurorianSummaryType,
      CopilotAurorianSummaryType,
      CopilotAurorianSummaryType,
      CopilotAurorianSummaryType,
      CopilotAurorianSummaryType,
    ],
    asset_link: r.asset_link,
    asset_type: r.asset_type,
  };
}
