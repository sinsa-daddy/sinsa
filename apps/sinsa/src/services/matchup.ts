import { AurorianAttributeType } from '@sinsa/schema';

/**
 * 克制链
 */
export const MATCH_UP: Record<AurorianAttributeType, AurorianAttributeType> = {
  [AurorianAttributeType.Water]: AurorianAttributeType.Fire,
  [AurorianAttributeType.Fire]: AurorianAttributeType.Forest,
  [AurorianAttributeType.Forest]: AurorianAttributeType.Thunder,
  [AurorianAttributeType.Thunder]: AurorianAttributeType.Water,
};

/**
 * 被克制链
 */
export const REVERSED_MATCH_UP: Record<
  AurorianAttributeType,
  AurorianAttributeType
> = {
  [AurorianAttributeType.Forest]: AurorianAttributeType.Fire,
  [AurorianAttributeType.Thunder]: AurorianAttributeType.Forest,
  [AurorianAttributeType.Water]: AurorianAttributeType.Thunder,
  [AurorianAttributeType.Fire]: AurorianAttributeType.Water,
};
