import { useModel } from '@modern-js/runtime/model';
import { Select } from 'antd';
import { useNavigate, useParams } from '@modern-js/runtime/router';
import { TermsModel } from '@/models/terms';
import { RoutePath } from '@/components/MyLayout/constants';

export const TermChanger: React.FC<{
  pathFn: typeof RoutePath.Copilots | typeof RoutePath.Solutions;
}> = ({ pathFn }) => {
  const params = useParams<{ term: `${number}` }>();
  const [terms] = useModel(TermsModel);
  const navigate = useNavigate();

  return (
    <Select
      value={params.term && Number.parseInt(params.term, 10)}
      options={terms.termsOptions}
      placeholder="荒典期数"
      onChange={(nextTerm: number) => {
        navigate(pathFn(nextTerm));
      }}
    />
  );
};
