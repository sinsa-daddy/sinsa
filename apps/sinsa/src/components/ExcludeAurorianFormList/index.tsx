import {
  ProForm,
  ProFormDependency,
  ProFormList,
  ProFormRate,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { useModel } from '@modern-js/runtime/model';
import { Button, Select, Tooltip } from 'antd';
import { Delete } from '@icon-park/react';
import { AdaptiveAurorianCard } from '../AdaptiveAurorianCard';
import { AuroriansModel, filterAuroriansOption } from '@/models/aurorians';

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
      actionRender={(field, action) => [
        <Tooltip key="delete" title="删除此光灵">
          <Button
            style={{ marginLeft: '.5rem' }}
            icon={<Delete />}
            onClick={e => {
              e.stopPropagation();
              action.remove(field.name);
            }}
          />
        </Tooltip>,
      ]}
    >
      {() => {
        return (
          <ProForm.Group>
            <ProForm.Item
              label="排除的光灵"
              name={'aurorianId'}
              rules={[{ required: true }]}
            >
              <Select
                options={auroriansOptions}
                showSearch
                allowClear={false}
                placeholder={'支持按拼音搜索光灵, 比如 ad 可以搜到 安顿'}
                filterOption={filterAuroriansOption}
              />
            </ProForm.Item>
            <ProFormDependency
              key="excludeBreakthroughOnly"
              name={['aurorianId']}
            >
              {({ aurorianId }) => {
                if (aurorianId) {
                  return (
                    <AdaptiveAurorianCard
                      readOnly
                      mini
                      aurorianId={aurorianId}
                    />
                  );
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
                        count: targetAurorian.rarity,
                        allowHalf: false,
                      }}
                      tooltip="大于等于此突破数的光灵会被排除，但不会排除零破的此光灵"
                      rules={[{ required: true }]}
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
