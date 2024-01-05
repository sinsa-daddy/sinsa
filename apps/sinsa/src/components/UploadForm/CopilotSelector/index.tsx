import { useModel } from '@modern-js/runtime/model';
import type { CopilotAurorianSummaryType } from '@sinsa/schema';
import { Flex, Select } from 'antd';
import { intersection } from 'lodash-es';
import { produce } from 'immer';
import styles from './styles.module.less';
import { getDefaultBreakthrough } from './utils/getDefaultBreakthrough';
import { AuroriansModel, filterAuroriansOption } from '@/models/aurorians';
import { AurorianTallCard } from '@/components/UploadForm/AurorianTallCard';

interface CopilotSelector {
  value?: CopilotAurorianSummaryType[];
  onChange?: (val: CopilotAurorianSummaryType[]) => void;
}

export const CopilotnSelector: React.FC<CopilotSelector> = ({
  value,
  onChange,
}) => {
  const [{ auroriansOptions, auroriansMap }] = useModel(AuroriansModel);
  const multiSelectValue = value?.map(item => item.aurorian_name);
  return (
    <Flex vertical gap={8}>
      <Select
        mode="multiple"
        options={auroriansOptions}
        placeholder="支持按拼音搜索, 比如 ad 可以搜到 安顿"
        showSearch
        allowClear={false}
        value={value?.map(item => item.aurorian_name)}
        filterOption={filterAuroriansOption}
        onChange={newVal => {
          const commonValues = intersection(multiSelectValue, newVal);
          const remainEntity = value?.filter(item =>
            commonValues.includes(item.aurorian_name),
          );
          onChange?.(
            newVal.slice(0, 5).map(newName => {
              const oldEntity = remainEntity?.find(
                entity => entity.aurorian_name === newName,
              );
              if (oldEntity) {
                return { ...oldEntity };
              }
              const targetAurorian = auroriansMap[newName];

              return {
                aurorian_name: newName,
                breakthrough: getDefaultBreakthrough(targetAurorian.rarity),
                is_replaceable: false,
              };
            }),
          );
        }}
      />

      <Flex className={styles.AuroriansTeam} wrap="wrap" gap={16}>
        {value?.map(
          ({ aurorian_name, breakthrough, is_replaceable }, index) => {
            return (
              <AurorianTallCard
                key={aurorian_name}
                name={aurorian_name}
                breakthrough={breakthrough}
                isReplaceable={is_replaceable}
                onBreakthroughChange={bt => {
                  onChange?.(
                    produce(value, draft => {
                      if (draft) {
                        draft[index].breakthrough = bt;
                      }
                    }),
                  );
                }}
                onReplaceableChange={r => {
                  onChange?.(
                    produce(value, draft => {
                      if (draft) {
                        draft[index].is_replaceable = r;
                      }
                    }),
                  );
                }}
              />
            );
          },
        )}
      </Flex>
    </Flex>
  );
};
