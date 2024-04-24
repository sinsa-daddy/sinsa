import { useModel } from '@modern-js/runtime/model';
import type { GridChildComponentProps } from 'react-window';
import { FixedSizeGrid } from 'react-window';
import {
  chunk,
  filter as filterAll,
  find,
  findKey,
  sortBy,
  toArray,
} from 'lodash-es';
import { useCallback, useMemo } from 'react';
import type { AurorianNextType } from '@sinsa/schema';
import AutoSizer from 'react-virtualized-auto-sizer';
import { produce } from 'immer';
import type { InnerAurorianSelectorFilterValue } from '../Filter/types';
import styles from './styles.module.less';
import { AuroriansModel } from '@/models/aurorians';
import { AdaptiveAurorianCard } from '@/components/AdaptiveAurorianCard';

const MULTI_LABELS = [1, 2, 3, 4, 5] as const;
const SINGLE_LABELS = [1] as const;
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

interface AurorianSelectorBoxProps {
  filter: InnerAurorianSelectorFilterValue;
  column?: number;
  selected: Record<number, AurorianNextType['aurorian_id'] | undefined>;
  setSelected: React.Dispatch<
    React.SetStateAction<
      Record<number, AurorianNextType['aurorian_id'] | undefined>
    >
  >;
  activeArurorianId: string | null;
  setActiveArurorianId: React.Dispatch<React.SetStateAction<string | null>>;
  multi?: boolean;
}

interface CellContext {
  selected: Record<number, AurorianNextType['aurorian_id'] | undefined>;
  dataSource: AurorianNextType[][];
  setSelected: React.Dispatch<
    React.SetStateAction<
      Record<number, AurorianNextType['aurorian_id'] | undefined>
    >
  >;
  activeArurorianId: string | null;
  setActiveArurorianId: React.Dispatch<React.SetStateAction<string | null>>;
  getNextLabel: () => ArrayElement<
    typeof MULTI_LABELS | typeof SINGLE_LABELS
  > | null;
}

const Cell: React.FC<GridChildComponentProps<CellContext>> = ({
  columnIndex,
  rowIndex,
  style,
  data: ctx,
}) => {
  const targetData = ctx.dataSource?.[rowIndex]?.[columnIndex];
  if (targetData) {
    const targetLabel = findKey(
      ctx.selected,
      value => value === targetData.aurorian_id,
    );
    return (
      <div style={style} className={styles.CellContainer}>
        <div
          className={styles.CardContainer}
          onClick={e => {
            e.stopPropagation();

            // 选择已有的
            if (typeof targetLabel === 'string') {
              ctx.setSelected(prev =>
                produce(prev, draft => {
                  delete draft[targetLabel as any];
                }),
              );
              ctx.setActiveArurorianId(null);

              return;
            }

            const nextLabel = ctx.getNextLabel();
            if (typeof nextLabel === 'number') {
              ctx.setSelected(prev => ({
                ...prev,
                [nextLabel]: targetData.aurorian_id,
              }));
              ctx.setActiveArurorianId(targetData.aurorian_id);
            }
          }}
        >
          <AdaptiveAurorianCard readOnly aurorianId={targetData.aurorian_id} />
          {typeof targetLabel === 'string' ? (
            <div className={styles.SelectedSingle}>{targetLabel}</div>
          ) : null}
        </div>
      </div>
    );
  }
  return null;
};

export const AurorianSelectorBox: React.FC<AurorianSelectorBoxProps> = ({
  filter,
  column = 3,
  selected,
  setSelected,
  activeArurorianId,
  setActiveArurorianId,
  multi,
}) => {
  const [{ auroriansMap }] = useModel(AuroriansModel);

  const dataSource = useMemo(() => {
    const filtered =
      filter.element === 'all'
        ? toArray(auroriansMap)
        : filterAll(
            auroriansMap,
            a =>
              a.primary_element === filter.element ||
              typeof find(selected, value => value === a.aurorian_id) ===
                'string',
          );

    const sorted = sortBy(filtered, a => {
      return (
        -a.rarity -
        (typeof find(selected, value => value === a.aurorian_id) === 'string' &&
        filter.element !== 'all' &&
        a.primary_element !== filter.element
          ? 100
          : 0)
      );
    });

    const chunked = chunk(sorted, column);

    return chunked;
  }, [auroriansMap, filter.element, column, selected]);

  const getNextLabel = useCallback((): ArrayElement<
    typeof SINGLE_LABELS | typeof MULTI_LABELS
  > | null => {
    for (const label of multi ? MULTI_LABELS : SINGLE_LABELS) {
      const target = selected[label];
      if (typeof target === 'string') {
        if (!multi) {
          return label;
        }
      } else {
        return label;
      }
    }

    // 都找到说明已经满了
    return null;
  }, [selected, multi]);

  const context = useMemo(() => {
    return {
      selected,
      dataSource,
      setSelected,
      getNextLabel,
      activeArurorianId,
      setActiveArurorianId,
    };
  }, [dataSource, selected, getNextLabel, activeArurorianId]);

  return (
    <div className={styles.BoxContainer}>
      <AutoSizer>
        {({ height, width }) => {
          return (
            <FixedSizeGrid<CellContext>
              columnCount={column}
              columnWidth={(column >= 4 ? width - 16 : width) / column}
              height={height}
              rowCount={dataSource.length}
              rowHeight={130 + 8}
              width={width}
              itemData={context}
            >
              {Cell}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
    </div>
  );
};
