import type { ProColumns } from '@ant-design/pro-components';
import type { CopilotType, TermType } from '@sinsa/schema';
import { Tag, Tooltip, Typography } from 'antd';
import { MessageOne } from '@icon-park/react';
import { AuroriansTeam } from '../AuroriansTeam';
import { RelativeTimeText } from '../RelativeTimeText';
import styles from './styles.module.less';

export interface TableParams {
  title?: CopilotType['title'];
  author?: CopilotType['author'];
  term?: number;
  dataSource?: CopilotType[];
  score?: [number, undefined] | [number, number] | [undefined, number];
  bv?: string;
}

export interface GetColumnsContext {
  currentTerm?: TermType;
  showScoreSorter?: boolean;
}

export function getCopilotsColumns({
  currentTerm,
  showScoreSorter,
}: GetColumnsContext): ProColumns<CopilotType>[] {
  return [
    {
      title: '光灵配置',
      dataIndex: 'aurorian_summaries',
      hideInSearch: true,
      render(_, entity) {
        return <AuroriansTeam aurorianSummaries={entity.aurorian_summaries} />;
      },
      width: 80 * 5 + 24,
    },
    {
      title: '分数',
      dataIndex: 'score',
      valueType: 'digit',
      hideInSearch: true,
      width: 100,
      sorter: showScoreSorter,
      align: 'right',
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
          <div className={styles.AuthorContainer}>
            <span>{dom}</span>
            <Tooltip title={entity.description}>
              {entity.description ? <MessageOne /> : null}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      render(_, entity) {
        return (
          <Typography.Link
            href={`https://www.bilibili.com/video/${entity.bv}`}
            target="_blank"
            title={entity.title}
          >
            {currentTerm?.term &&
            entity.rerun_terms?.includes(currentTerm.term) ? (
              <Tooltip title={`复刻第 ${entity.term} 期荒典作业`}>
                <Tag color="red">复刻</Tag>
              </Tooltip>
            ) : null}
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
      render(_, entity) {
        return <RelativeTimeText time={entity.upload_time} />;
      },
    },
    {
      title: 'BV 号',
      dataIndex: 'bv',
      hideInTable: true,
      fieldProps: { placeholder: 'BVXXXXXXXXXX' },
    },
  ];
}
