import { useCallback, useMemo, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { CopilotType } from '@sinsa/schema';
import { type TableParams, copilotsColumns } from './columns';

interface CopilotsTableProps {
  dataSource: CopilotType[];
  term?: `${number}`;
}

export function copilotRowKey(c: CopilotType) {
  return c.bv;
}

const TABLE_CONST_PROPS = {
  pagination: {
    pageSize: 5,
    size: 'default',
    position: ['bottomCenter'] as any,
  },
  scroll: { x: 'max-content', scrollToFirstRowOnChange: true },
  toolbar: { title: '收录作业' },
} as const;

export const CopilotsTable: React.FC<CopilotsTableProps> = ({
  dataSource,
  term,
}) => {
  const actionRef = useRef<ActionType>();

  const deps = useMemo(
    (): TableParams => ({ term, dataSource }),
    [term, dataSource],
  );

  const request = useCallback(async (params: TableParams) => {
    return {
      data:
        params.dataSource?.filter(item => {
          let ok = true;
          if (params.title) {
            ok = item.title.includes(params.title);
          }
          return ok;
        }) ?? [],
      success: true,
    };
  }, []);

  return (
    <ProTable<CopilotType, TableParams>
      rowKey={copilotRowKey}
      actionRef={actionRef}
      columns={copilotsColumns}
      params={deps}
      request={request}
      {...TABLE_CONST_PROPS}
    />
  );
};
