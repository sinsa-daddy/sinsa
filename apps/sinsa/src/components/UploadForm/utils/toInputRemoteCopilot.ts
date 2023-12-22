import { AurorianType, CopilotType, TermType } from '@sinsa/schema';

export function toInputRemoteCopilot(
  c: CopilotType,
  {
    termsMap,
    auroriansMap,
  }: {
    termsMap: Record<TermType['term'], TermType>;
    auroriansMap: Record<AurorianType['aurorian_name'], AurorianType>;
  },
) {
  return {
    bv: c.bv,
    title: c.title,
    description: c.description,
    author: c.author,
    insert_db_time: c.insert_db_time?.valueOf(),
    upload_time: c.upload_time.valueOf(),
    score: Number(c.score),
    term: [
      termsMap[c.term]._record_id,
      ...c.term_rerun.map(term => termsMap[term]._record_id),
    ],
    aurorian_1: [
      auroriansMap[c.aurorian_summaries[0].aurorian_name]._record_id,
    ],
    aurorian_1_breakthrough: String(c.aurorian_summaries[0].breakthrough),
    aurorian_2: [
      auroriansMap[c.aurorian_summaries[1].aurorian_name]._record_id,
    ],
    aurorian_2_breakthrough: String(c.aurorian_summaries[1].breakthrough),
    aurorian_3: [
      auroriansMap[c.aurorian_summaries[2].aurorian_name]._record_id,
    ],
    aurorian_3_breakthrough: String(c.aurorian_summaries[2].breakthrough),
    aurorian_4: [
      auroriansMap[c.aurorian_summaries[3].aurorian_name]._record_id,
    ],
    aurorian_4_breakthrough: String(c.aurorian_summaries[3].breakthrough),
    aurorian_5: [
      auroriansMap[c.aurorian_summaries[4].aurorian_name]._record_id,
    ],
    aurorian_5_breakthrough: String(c.aurorian_summaries[4].breakthrough),
    replaceable_position: c.aurorian_summaries
      .map((item, index) => (item.is_replaceable ? `${index + 1}` : null))
      .filter((n): n is string => typeof n === 'string'),
  };
}
