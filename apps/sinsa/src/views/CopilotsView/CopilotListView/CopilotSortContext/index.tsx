import constate from 'constate';
import { useState } from 'react';
import { CopilotSorter } from './types';

export const [CopilotSorterProvider, useCopilotSorter] = constate(() => {
  const [sorter, setSorter] = useState(CopilotSorter.UploadTime);

  return {
    sorter,
    setSorter,
  };
});
