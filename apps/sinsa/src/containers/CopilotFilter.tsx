import { Card } from 'antd';
import { QueryFilter, ProFormSelect } from '@ant-design/pro-form';
import { useModel } from '@modern-js/runtime/model';
import { TermsModel } from '@/models/terms';

export const CopilotFilter: React.FC = () => {
  const [terms] = useModel(TermsModel);
  return (
    <Card>
      <QueryFilter>
        <ProFormSelect
          name={'term'}
          label="荒典期数"
          options={terms.termsOptions}
        />
      </QueryFilter>
    </Card>
  );
};
