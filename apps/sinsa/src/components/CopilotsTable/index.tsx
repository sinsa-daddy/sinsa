import { useCallback, useMemo, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { ProTable } from '@ant-design/pro-table';
import type { CopilotType } from '@sinsa/schema';
import { type TableParams, columns } from './columns';

interface CopilotsTableProps {
  dataSource: CopilotType[];
  term?: `${number}`;
}

function rowKey(c: CopilotType) {
  return c.bv;
}

export const CopilotsTable: React.FC<CopilotsTableProps> = ({
  dataSource,
  term,
}) => {
  const actionRef = useRef<ActionType>();

  const deps = useMemo((): TableParams => ({ term }), [term]);

  const request = useCallback(async (params: TableParams) => {
    return {
      data: dataSource.filter(item => {
        let ok = true;
        if (params.title) {
          ok = item.title.includes(params.title);
        }
        return ok;
      }),
      success: true,
    };
  }, []);

  return (
    <ProTable<CopilotType, TableParams>
      toolbar={{ title: '收录作业' }}
      rowKey={rowKey}
      actionRef={actionRef}
      columns={columns}
      params={deps}
      request={request}
    />
  );
};
