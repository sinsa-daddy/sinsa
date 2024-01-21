import { useModel } from '@modern-js/runtime/model';
import { Select } from 'antd';
import { useNavigate, useParams } from '@modern-js/runtime/router';
import { useMemo } from 'react';
import { TermsModel } from '@/models/terms';
import type { RoutePath } from '@/views/GlobalLayout/constants';

export function useTargetTermFromParams() {
  const params = useParams<{ term: `${number}` | 'latest' }>();
  const [{ termsMap, latestTerm }] = useModel(TermsModel);
  const targetTerm = useMemo(() => {
    if (!params.term) {
      return undefined;
    }
    return params.term === 'latest' ? latestTerm : termsMap[params.term];
  }, [params.term, latestTerm?.term]);

  return {
    targetTerm,
  };
}

export const TermChanger: React.FC<{
  pathFn: typeof RoutePath.Copilots | typeof RoutePath.Solutions;
}> = ({ pathFn }) => {
  const [terms] = useModel(TermsModel);
  const { targetTerm } = useTargetTermFromParams();
  const navigate = useNavigate();

  return (
    <Select
      value={targetTerm?.term}
      options={terms.termsOptions}
      placeholder="荒典期数"
      onChange={(nextTerm: number) => {
        navigate(
          pathFn(nextTerm === terms.latestTerm?.term ? 'latest' : nextTerm),
        );
      }}
    />
  );
};
