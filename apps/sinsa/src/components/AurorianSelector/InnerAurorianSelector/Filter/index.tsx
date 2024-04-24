import { Segmented } from 'antd';
import { AurorianAttributeType } from '@sinsa/schema';
import type { SegmentedOptions } from 'antd/es/segmented';
import { produce } from 'immer';
import type { InnerAurorianSelectorFilterValue } from './types';
import styles from './styles.module.less';
import { ElementURLMapper } from '@/components/AdaptiveAurorianCard/constants';

interface InnerAurorianSelectorFilterProps {
  value: InnerAurorianSelectorFilterValue;
  onChange: (v: InnerAurorianSelectorFilterValue) => void;
}

const FilterElementOptions: SegmentedOptions<AurorianAttributeType | 'all'> = [
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '水',
    value: AurorianAttributeType.Water,
    icon: (
      <img
        className={styles.FilterElementIcon}
        alt={AurorianAttributeType.Water}
        src={ElementURLMapper[AurorianAttributeType.Water]}
      />
    ),
  },
  {
    label: '火',
    value: AurorianAttributeType.Fire,
    icon: (
      <img
        className={styles.FilterElementIcon}
        alt={AurorianAttributeType.Fire}
        src={ElementURLMapper[AurorianAttributeType.Fire]}
      />
    ),
  },
  {
    label: '森',
    value: AurorianAttributeType.Forest,
    icon: (
      <img
        className={styles.FilterElementIcon}
        alt={AurorianAttributeType.Forest}
        src={ElementURLMapper[AurorianAttributeType.Forest]}
      />
    ),
  },
  {
    label: '雷',
    value: AurorianAttributeType.Thunder,
    icon: (
      <img
        className={styles.FilterElementIcon}
        alt={AurorianAttributeType.Thunder}
        src={ElementURLMapper[AurorianAttributeType.Thunder]}
      />
    ),
  },
];

export const InnerAurorianSelectorFilter: React.FC<
  InnerAurorianSelectorFilterProps
> = ({ value, onChange }) => {
  return (
    <>
      <Segmented
        size="large"
        value={value.element}
        options={FilterElementOptions}
        onChange={nextElement => {
          onChange(
            produce(value, draft => {
              draft.element = nextElement;
            }),
          );
        }}
      />
    </>
  );
};
