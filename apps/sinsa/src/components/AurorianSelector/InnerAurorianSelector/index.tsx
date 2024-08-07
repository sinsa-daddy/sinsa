import { Flex, Grid } from 'antd';
import { useState } from 'react';
import type { AurorianNextType, AurorianRequirementType } from '@sinsa/schema';
import { InnerAurorianSelectorFilter } from './Filter';
import type { InnerAurorianSelectorFilterValue } from './Filter/types';
import { AurorianSelectorBox } from './Box';
import { AurorianSelectorDetail } from './Detail';

export interface InnerAurorianSelectorProps {
  // 是否是快速编队
  multi?: boolean;
}

export const InnerAurorianSelector: React.FC<InnerAurorianSelectorProps> = ({
  multi,
}) => {
  const screen = Grid.useBreakpoint();

  const [filterValue, setFilterValue] =
    useState<InnerAurorianSelectorFilterValue>(() => ({
      element: 'all',
    }));

  const [selected, setSelected] = useState<
    Record<number, AurorianNextType['aurorian_id'] | undefined>
  >(() => ({}));
  const [requireMap, setRequireMap] = useState<
    Record<AurorianNextType['aurorian_id'], AurorianRequirementType | undefined>
  >(() => ({}));
  const [activeArurorianId, setActiveArurorianId] = useState<
    AurorianNextType['aurorian_id'] | null
  >(null);

  console.log(
    'selected',
    selected,
    activeArurorianId,
    multi ? 'multi' : undefined,
    requireMap,
  );

  return !screen.md ? (
    <Flex vertical gap={8}>
      <InnerAurorianSelectorFilter
        value={filterValue}
        onChange={setFilterValue}
      />
      <AurorianSelectorBox
        selected={selected}
        setSelected={setSelected}
        filter={filterValue}
        activeArurorianId={activeArurorianId}
        setActiveArurorianId={setActiveArurorianId}
        multi={multi}
      />
      <AurorianSelectorDetail
        activeArurorianId={activeArurorianId}
        value={requireMap}
        onChange={setRequireMap}
      />
    </Flex>
  ) : (
    <Flex wrap="nowrap" gap={8}>
      <Flex vertical gap={8} style={{ flexBasis: 0, flexGrow: 1 }}>
        <InnerAurorianSelectorFilter
          value={filterValue}
          onChange={setFilterValue}
        />
        <AurorianSelectorBox
          selected={selected}
          setSelected={setSelected}
          column={!screen.lg ? 4 : 6}
          filter={filterValue}
          activeArurorianId={activeArurorianId}
          setActiveArurorianId={setActiveArurorianId}
          multi={multi}
        />
      </Flex>
      <div style={{ width: '400px' }}>
        <AurorianSelectorDetail
          activeArurorianId={activeArurorianId}
          value={requireMap}
          onChange={setRequireMap}
        />
      </div>
    </Flex>
  );
};
