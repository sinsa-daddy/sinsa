import type { AurorianNextType } from '@sinsa/schema';
import {
  AurorianAttributeType,
  AurorianClassType,
  AurorianNextSchema,
} from '@sinsa/schema';
import { toSlug } from '../../slug';
import { logger } from '../../logger';
import type { SimpleAurorianType } from '../schema/simple-aurorians';
import { SimpleAurorianList } from '../schema/simple-aurorians';
import { NotionSubmitEnvSchema } from '../schema/env';

const ElementMapper: Record<
  SimpleAurorianType['element'],
  AurorianNextType['primary_element']
> = {
  1: AurorianAttributeType.Water,
  2: AurorianAttributeType.Fire,
  3: AurorianAttributeType.Forest,
  4: AurorianAttributeType.Thunder,
};

const ProfessionMapper: Record<
  SimpleAurorianType['profession'],
  AurorianNextType['profession']
> = {
  2001: AurorianClassType.Converter,
  2002: AurorianClassType.Sniper,
  2003: AurorianClassType.Detonator,
  2004: AurorianClassType.Supporter,
};

export async function getAuroriansSource() {
  const env = NotionSubmitEnvSchema.parse(process.env);

  const [baseList, enNameList] = await Promise.all([
    fetch(env.CHINA_AURORIAN_LIST_API, {
      mode: 'cors',
      cache: 'no-cache',
    })
      .then(res => res.json())
      .then(json => SimpleAurorianList.parse(json)),
    fetch(env.GLOBAL_AURORIAN_LIST_API, {
      mode: 'cors',
      cache: 'no-cache',
    })
      .then(res => res.json())
      .then(json => SimpleAurorianList.parse(json)),
  ]);

  const resultArray: AurorianNextType[] = [];

  const enNameRecord = enNameList.reduce((acc, next) => {
    return {
      ...acc,
      [next.gameId]: next,
    };
  }, {} as Record<SimpleAurorianType['gameId'], SimpleAurorianType>);

  const avatarURLMap: Record<AurorianNextType['aurorian_id'], string> = {};

  for (const base of baseList) {
    const enName = enNameRecord[base.gameId]?.name;
    if (!enName) {
      continue;
    }
    const id = toSlug(enName);
    resultArray.push(
      AurorianNextSchema.parse({
        aurorian_id: id,
        name: enName,
        rarity: base.rarity,
        cn_name: base.name,
        primary_element: ElementMapper[base.element],
        secondary_element: ElementMapper[base.element2],
        profession: ProfessionMapper[base.profession],
      }),
    );
    avatarURLMap[id] = base.baseThumbnail;
  }

  if (!resultArray.length) {
    throw new Error('There is no aurorians');
  } else {
    logger.info(`got ${resultArray.length} aurorians`);
  }

  return {
    auroriansMap: resultArray.reduce((acc, next) => {
      return {
        ...acc,
        [next.aurorian_id]: next,
      };
    }, {} as Record<AurorianNextType['aurorian_id'], AurorianNextType>),
    avatarURLMap,
  };
}
