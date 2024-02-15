import { Select } from 'antd';
import type React from 'react';
import { CopilotSorter } from './types';
import { useCopilotSorter } from '.';

const CopilotSorterOptions = [
  { label: '按最近上传时间', value: CopilotSorter.UploadTime },
  { label: '按分数高至低', value: CopilotSorter.Score },
  { label: '按分数低至高', value: CopilotSorter.ReversedScore },
];

export const CopilotSelect: React.FC = () => {
  const { sorter, setSorter } = useCopilotSorter();
  return (
    <Select
      options={CopilotSorterOptions}
      value={sorter}
      onChange={setSorter}
    />
  );
};
