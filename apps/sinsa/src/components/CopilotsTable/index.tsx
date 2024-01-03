import { useCallback, useMemo, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { CopilotType, TermType } from '@sinsa/schema';
import type { SortOrder } from 'antd/es/table/interface';
import { Card } from 'antd';
import { type TableParams, getCopilotsColumns } from './columns';

interface CopilotsTableProps {
  dataSource: CopilotType[];
  currentTerm?: TermType;
}

export function copilotRowKey(c: CopilotType) {
  return c.bv;
}

const TABLE_CONST_PROPS = {
  pagination: {
    pageSize: 5,
    size: 'default',
    position: ['bottomCenter'] as any,
    showTotal(total: number): string {
      return `总共 ${total} 条作业`;
    },
  },
  scroll: { x: 'max-content', scrollToFirstRowOnChange: true },
} as const;

export const CopilotsTable: React.FC<CopilotsTableProps> = ({
  dataSource,
  currentTerm: term,
}) => {
  const actionRef = useRef<ActionType>();

  const deps = useMemo(
    (): TableParams => ({
      term: term?.term,
      dataSource,
    }),
    [term?.term, dataSource],
  );

  const request = useCallback(
    async (params: TableParams, sort: Record<string, SortOrder>) => {
      const base =
        params.dataSource?.filter(item => {
          let ok = true;
          if (params.title?.includes('[hidden]')) {
            ok = false;
          }
          if (params.title) {
            ok = item.title.includes(params.title);
          }
          // min
          if (typeof params.score?.[0] === 'number') {
            ok = params.score[0] <= item.score;
          }

          // max
          if (typeof params.score?.[1] === 'number') {
            ok = item.score <= params.score[1];
          }

          // bv
          if (typeof params.bv === 'string' && params.bv.startsWith('BV')) {
            ok = item.bv === params.bv;
          }
          return ok;
        }) ?? [];
      return {
        data: sort.score
          ? base.sort((a, b) =>
              sort.score === 'ascend' ? a.score - b.score : b.score - a.score,
            )
          : base,
        success: true,
      };
    },
    [],
  );

  const columns = useMemo(
    () => getCopilotsColumns({ currentTerm: term, showScoreSorter: true }),
    [term?.term],
  );

  return (
    <Card>
      <ProTable<CopilotType, TableParams>
        rowKey={copilotRowKey}
        actionRef={actionRef}
        columns={columns}
        params={deps}
        request={request}
        search={false}
        toolBarRender={false}
        ghost
        {...TABLE_CONST_PROPS}
      />
    </Card>
  );
};
