import {
  ProForm,
  ProFormDependency,
  ProFormList,
  ProFormRate,
  ProFormSelect,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { useModel } from '@modern-js/runtime/model';
import { RarityMapper } from '../AurorianCard/constants';
import { AurorianCard } from '../AurorianCard';
import { AuroriansModel } from '@/models/aurorians';

interface ExcludeFormListProps {
  name: string;
}

export const ExcludeAurorianFormList: React.FC<ExcludeFormListProps> = ({
  name,
  ...props
}) => {
  const [{ auroriansOptions, auroriansMap }] = useModel(AuroriansModel);
  return (
    <ProFormList
      {...props}
      creatorButtonProps={{
        creatorButtonText: '添加排除的光灵',
      }}
      name={name}
      alwaysShowItemLabel
    >
      {() => {
        return (
          <ProForm.Group>
            <ProFormSelect
              label="排除的光灵"
              name={'aurorianName'}
              options={auroriansOptions}
              allowClear
              showSearch
              width={'sm'}
              rules={[{ required: true }]}
            />
            <ProFormDependency
              key="excludeBreakthroughOnly"
              name={['aurorianName']}
            >
              {({ aurorianName }) => {
                if (aurorianName) {
                  return <AurorianCard sameSize name={aurorianName} />;
                }
                return null;
              }}
            </ProFormDependency>
            <ProFormDependency
              key="excludeBreakthroughOnly"
              name={['aurorianName']}
            >
              {({ aurorianName }) => {
                if (aurorianName) {
                  return (
                    <ProFormSwitch
                      label="仅排除突破"
                      name="excludeBreakthroughOnly"
                    />
                  );
                }
                return null;
              }}
            </ProFormDependency>

            <ProFormDependency
              key="excludeBreakthrough"
              name={['aurorianName', 'excludeBreakthroughOnly']}
            >
              {({ aurorianName, excludeBreakthroughOnly }) => {
                const targetAurorian = auroriansMap[aurorianName];
                if (excludeBreakthroughOnly && targetAurorian) {
                  return (
                    <ProFormRate
                      name="excludeBreakthrough"
                      label="排除突破数"
                      fieldProps={{
                        count: RarityMapper[targetAurorian.rarity],
                        allowHalf: false,
                      }}
                      tooltip="此突破数以上的光灵会被排除，但不会排除零破的此光灵"
                    />
                  );
                }
                return null;
              }}
            </ProFormDependency>
          </ProForm.Group>
        );
      }}
    </ProFormList>
  );
};
