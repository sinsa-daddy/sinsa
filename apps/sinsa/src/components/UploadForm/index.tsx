import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { useModel } from '@modern-js/runtime/model';
import { TermsModel } from '@/models/terms';

export const UploadForm: React.FC = () => {
  const [{ termsOptions }] = useModel(TermsModel);
  return (
    <ProForm>
      <ProFormSelect
        name="term"
        label="荒典期数"
        options={termsOptions}
        rules={[{ required: true }]}
      />
    </ProForm>
  );
};
