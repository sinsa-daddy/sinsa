import { antdDrawerV5, create, useModal } from '@ebay/nice-modal-react';
import { Flex, Grid, Drawer, Space, Button } from 'antd';
import type { AurorianNextType, AurorianRequirementType } from '@sinsa/schema';
import { useState } from 'react';
import { AurorianSelectorBox } from './InnerAurorianSelector/Box';
import { AurorianSelectorDetail } from './InnerAurorianSelector/Detail';
import { InnerAurorianSelectorFilter } from './InnerAurorianSelector/Filter';
import type { InnerAurorianSelectorFilterValue } from './InnerAurorianSelector/Filter/types';

interface AurorianSelectorProps {
  // 是否是快速编队
  multi?: boolean;
  initialValue?: AurorianRequirementType[];
}

function getResolve(
  selected: Record<number, string | undefined>,
  requireMap: Record<string, AurorianRequirementType | undefined>,
): AurorianRequirementType[] {
  const order = Object.entries(selected)
    .toSorted((a, b) => Number(a[0]) - Number(b[0]))
    .filter(item => typeof item[1] === 'string')
    .map(item => item[1]!)
    .map(aid => requireMap[aid])
    .filter((item): item is AurorianRequirementType => Boolean(item));
  return order;
}

export const AurorianSelector = create<AurorianSelectorProps>(
  ({ multi, initialValue }) => {
    const modal = useModal();

    const screen = Grid.useBreakpoint();

    const [filterValue, setFilterValue] =
      useState<InnerAurorianSelectorFilterValue>(() => ({
        element: 'all',
      }));

    const [selected, setSelected] = useState<
      Record<number, AurorianNextType['aurorian_id'] | undefined>
    >(() => {
      const result: Record<
        number,
        AurorianNextType['aurorian_id'] | undefined
      > = {};
      if (initialValue) {
        for (let i = 0; i < initialValue.length ?? 0; i++) {
          result[i + 1] = initialValue[i].aurorian_id;
        }
      }
      return result;
    });
    const [requireMap, setRequireMap] = useState<
      Record<
        AurorianNextType['aurorian_id'],
        AurorianRequirementType | undefined
      >
    >(() => {
      const result: Record<
        AurorianNextType['aurorian_id'],
        AurorianRequirementType | undefined
      > = {};
      if (initialValue) {
        for (const rq of initialValue) {
          result[rq.aurorian_id] = rq;
        }
      }
      return result;
    });
    const [activeArurorianId, setActiveArurorianId] = useState<
      AurorianNextType['aurorian_id'] | null
    >(null);

    const isLarge = screen.md;

    return (
      <Drawer
        {...antdDrawerV5(modal)}
        bodyStyle={{ padding: 0 }}
        placement="bottom"
        title={multi ? '快速编队' : '选择光灵'}
        // onOk={e => {
        //   e.stopPropagation();
        //   const resolveValue = getResolve(selected, requireMap);
        //   modal.resolve(resolveValue);
        //   modal.hide();
        // }}
        height={isLarge ? 'calc(50vh + 120px)' : '95vh'}
        extra={
          <Space>
            <Button
              type="primary"
              onClick={e => {
                e.stopPropagation();
                const resolveValue = getResolve(selected, requireMap);
                modal.resolve(resolveValue);
                modal.hide();
              }}
            >
              完成
            </Button>
          </Space>
        }
        // width={'1080px'}
      >
        {!isLarge ? (
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
              requireMap={requireMap}
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
                requireMap={requireMap}
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
        )}
      </Drawer>
    );
  },
);
