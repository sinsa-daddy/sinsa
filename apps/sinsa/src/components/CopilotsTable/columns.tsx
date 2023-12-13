import type { ProColumns } from '@ant-design/pro-components';
import type { CopilotType } from '@sinsa/schema';
import { Tooltip, Typography } from 'antd';
import { AuroriansTeam } from '../AuroriansTeam';

export interface TableParams {
  title?: CopilotType['title'];
  author?: CopilotType['author'];
  term?: `${number}`;
  dataSource?: CopilotType[];
  score?: [number, undefined] | [number, number] | [undefined, number];
}

export const copilotsColumns: ProColumns<CopilotType>[] = [
  {
    title: '光灵配置',
    dataIndex: 'aurorian_summaries',
    hideInSearch: true,
    render(_, entity) {
      return <AuroriansTeam aurorianSummaries={entity.aurorian_summaries} />;
    },
    width: 80 * 5 + 48,
  },
  {
    title: '结算分数',
    dataIndex: 'score',
    valueType: 'digit',
    hideInSearch: true,
    width: 130,
  },
  {
    title: '作者',
    dataIndex: 'author',
    valueType: 'select',
    hideInSearch: true,
    ellipsis: true,
    width: 160,
    renderText(dom, entity) {
      return (
        <>
          {dom}
          <Tooltip title={entity.description}>
            {entity.description ? '🗒' : null}
          </Tooltip>
        </>
      );
    },
  },
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
    render(dom, entity) {
      return (
        <Typography.Link
          href={`https://b23.tv/${entity.bv}`}
          target="_blank"
          title={entity.title}
        >
          {entity.title}
        </Typography.Link>
      );
    },
  },
  {
    title: '上传时间',
    dataIndex: 'upload_time',
    valueType: 'dateTime',
    width: 160,
    hideInSearch: true,
  },
];
