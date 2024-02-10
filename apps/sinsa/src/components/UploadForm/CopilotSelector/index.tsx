import { useModel } from '@modern-js/runtime/model';
import { Flex, Select } from 'antd';
import { intersection } from 'lodash-es';
import { produce } from 'immer';
import type { AurorianRequirementType } from '@sinsa/schema';
import styles from './styles.module.less';
import { getDefaultBreakthrough } from './utils/getDefaultBreakthrough';
import { AuroriansModel, filterAuroriansOption } from '@/models/aurorians';
import { AurorianTallCard } from '@/components/UploadForm/AurorianTallCard';

interface CopilotSelector {
  value?: AurorianRequirementType[];
  onChange?: (val: AurorianRequirementType[]) => void;
}

export const CopilotnSelector: React.FC<CopilotSelector> = ({
  value,
  onChange,
}) => {
  const [{ auroriansOptions, auroriansMap }] = useModel(AuroriansModel);
  const multiSelectValue = value?.map(item => item.aurorian_id);
  return (
    <Flex vertical gap={8}>
      <Select
        mode="multiple"
        options={auroriansOptions}
        placeholder="支持按拼音搜索, 比如 ad 可以搜到 安顿"
        showSearch
        allowClear={false}
        value={value?.map(item => item.aurorian_id)}
        filterOption={filterAuroriansOption}
        onChange={newVal => {
          const commonValues = intersection(multiSelectValue, newVal);
          const remainEntity = value?.filter(item =>
            commonValues.includes(item.aurorian_id),
          );
          onChange?.(
            newVal.slice(0, 5).map(newId => {
              const oldEntity = remainEntity?.find(
                entity => entity.aurorian_id === newId,
              );
              if (oldEntity) {
                return { ...oldEntity };
              }
              const targetAurorian = auroriansMap[newId];

              return {
                aurorian_id: newId,
                breakthrough: getDefaultBreakthrough(targetAurorian.rarity),
                // is_replaceable: false,
              } as AurorianRequirementType;
            }),
          );
        }}
      />

      <Flex className={styles.AuroriansTeam} wrap="wrap" gap={16}>
        {value?.map(({ aurorian_id, breakthrough, remark }, index) => {
          return (
            <AurorianTallCard
              key={aurorian_id}
              id={aurorian_id}
              breakthrough={breakthrough}
              remark={remark}
              onBreakthroughChange={bt => {
                onChange?.(
                  produce(value, draft => {
                    if (draft) {
                      draft[index].breakthrough = bt;
                    }
                  }),
                );
              }}
              onRemarkChange={r => {
                onChange?.(
                  produce(value, draft => {
                    if (draft) {
                      draft[index].remark = r;
                    }
                  }),
                );
              }}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};
