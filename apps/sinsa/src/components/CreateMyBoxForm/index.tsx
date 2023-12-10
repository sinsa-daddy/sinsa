import {
  type ProFormInstance,
  StepsForm,
  ProFormText,
} from '@ant-design/pro-form';
import { useModel } from '@modern-js/runtime/model';
import { useMemo, useRef } from 'react';
import { groupBy } from 'lodash';
import { Form } from 'antd';
import { CheckCard } from '@ant-design/pro-card';
import { AurorianAttributeType } from '@sinsa/schema';
import { CheckControlAurorianBoxCard } from '../CheckControlAurorianBoxCard';
import { AuroriansModel } from '@/models/aurorians';

export const CreateMyBoxForm: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [{ auroriansMap }] = useModel(AuroriansModel);

  const chunks = useMemo(() => {
    return groupBy(Object.values(auroriansMap), item => item.attribute);
  }, [auroriansMap]);

  console.log('chunks', chunks);
  return (
    <StepsForm formRef={formRef}>
      <StepsForm.StepForm title="完成 Box 名称">
        <ProFormText
          name="title"
          label="Box 名称"
          placeholder="给 Box 取一个好听的名字"
          rules={[{ required: true }]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        title="选择火属性光灵"
        onValuesChange={changed => {
          console.log('changed', changed);
        }}
      >
        <Form.Item name={'fire'}>
          <CheckCard.Group multiple>
            {chunks[AurorianAttributeType.Fire].map(aurorian => (
              <CheckControlAurorianBoxCard
                key={aurorian.aurorian_name}
                name={aurorian.aurorian_name}
              />
            ))}
          </CheckCard.Group>
        </Form.Item>
      </StepsForm.StepForm>
    </StepsForm>
  );
};
