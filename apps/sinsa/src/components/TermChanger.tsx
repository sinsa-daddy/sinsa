import { useModel } from '@modern-js/runtime/model';
import { Select } from 'antd';
import { useNavigate, useParams } from '@modern-js/runtime/router';
import { useMemo } from 'react';
import { TermsModel } from '@/models/terms';
import type { RoutePath } from '@/views/GlobalLayout/constants';

export function useTargetTermFromParams() {
  const params = useParams<{ termId: string | 'latest' }>();
  const [{ termsMap, latestTerm }] = useModel(TermsModel);

  const targetTerm = useMemo(() => {
    if (!params.termId) {
      return undefined;
    }
    return params.termId === 'latest' ? latestTerm : termsMap[params.termId];
  }, [params.termId, latestTerm?.term_id]);

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
      value={targetTerm?.term_id}
      options={terms.termsOptions}
      placeholder="荒典期数"
      onChange={nextTerm => {
        navigate(
          pathFn(nextTerm === terms.latestTerm?.term_id ? 'latest' : nextTerm),
        );
      }}
    />
  );
};
