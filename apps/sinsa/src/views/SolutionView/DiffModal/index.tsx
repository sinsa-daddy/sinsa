import { antdModalV5, create, useModal } from '@ebay/nice-modal-react';
import type {
  AurorianNextType,
  CopilotNextType,
  TermNextType,
} from '@sinsa/schema';
import { Button, Flex, Modal, Space, Tag, Tooltip, Typography } from 'antd';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormList,
  ProFormRate,
  ProFormSelect,
} from '@ant-design/pro-components';
import numeral from 'numeral';
import { ArrowDown, ArrowRight, Delete } from '@icon-park/react';
import { useMemo } from 'react';
import { useModel } from '@modern-js/runtime/model';
import clsx from 'clsx';
import {
  CopilotDiffSchema,
  type CopilotDiffAuroriansReplaceType,
  type CopilotDiffType,
} from '../schemas/query-params';
import styles from './styles.module.less';
import { patchAurorianRequirements } from './helpers/patch';
import { AdaptiveAuroriansTeam } from '@/components/SolutionCard/CopilotBlock/AdaptiveAuroriansTeam';
import { RelativeTimeText } from '@/components/RelativeTimeText';
import { trimTitle } from '@/components/utils';
import { AuroriansModel, filterAuroriansOption } from '@/models/aurorians';

interface DiffModalProps {
  type: 'create' | 'edit';
  currentTerm: TermNextType;
  originCopilot: CopilotNextType;
  replaceAurorians: AurorianNextType[];
}

function ensureDiffKey(key: keyof CopilotDiffType) {
  return key;
}

function ensureDiffReplaceKey(key: keyof CopilotDiffAuroriansReplaceType) {
  return key;
}

export const DiffModal = create<DiffModalProps>(
  ({ originCopilot, currentTerm, replaceAurorians }) => {
    const modal = useModal();
    const [{ auroriansOptions, auroriansMap }] = useModel(AuroriansModel);

    const [form] = ProForm.useForm<CopilotDiffType>();

    const initialValues: Partial<CopilotDiffType> = {
      copilotId: originCopilot.copilot_id,
      auroriansReplace: replaceAurorians.length
        ? replaceAurorians.map(a => {
            return {
              origin: a.aurorian_id,
              alter: undefined,
            } as any;
          })
        : undefined,
    };

    const displayTitle = useMemo(
      () => trimTitle(originCopilot.title),
      [originCopilot.title],
    );

    return (
      <Modal
        {...antdModalV5(modal)}
        title={'替换作业中的光灵'}
        width={'100%'}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          form.resetFields();
          modal.hide();
        }}
        className={styles.Modal}
      >
        <ProForm
          onFinish={async values => {
            console.log('submit', values);
            modal.hide();
          }}
          form={form}
          initialValues={initialValues}
          submitter={false}
          layout="horizontal"
        >
          <Flex vertical gap={8}>
            <div className={styles.PaddingContainer}>
              <div className={styles.Title}>
                <Typography.Link
                  href={`https://www.bilibili.com/video/${originCopilot.href}`}
                  target="_blank"
                  title={originCopilot.title}
                  ellipsis={true}
                >
                  {currentTerm?.term_id &&
                  originCopilot.term_id !== currentTerm.term_id ? (
                    <Tooltip title={`复刻 ${originCopilot.term_id} 期荒典`}>
                      <Tag color="red">复刻</Tag>
                    </Tooltip>
                  ) : null}
                  {displayTitle}
                </Typography.Link>
              </div>
              <Flex className={styles.Header} wrap={'wrap'}>
                <ProFormDependency name={[ensureDiffKey('diffScore')]}>
                  {({ diffScore }: Pick<CopilotDiffType, 'diffScore'>) => {
                    const showDeleted =
                      typeof diffScore === 'number' && diffScore !== 0;
                    return (
                      <Flex align="center" gap={4}>
                        <span
                          className={clsx(
                            styles.Score,
                            showDeleted && styles.Deleted,
                          )}
                        >
                          {numeral(originCopilot.score).format('0,0')}
                        </span>
                        {showDeleted ? (
                          <span className={clsx(styles.Score)}>
                            {numeral(
                              originCopilot.score + (diffScore ?? 0),
                            ).format('0,0')}
                          </span>
                        ) : null}
                      </Flex>
                    );
                  }}
                </ProFormDependency>

                <Flex className={styles.Author} align="center" gap={6}>
                  <Typography.Text strong>
                    {originCopilot.author_name}
                  </Typography.Text>

                  <RelativeTimeText time={originCopilot.upload_time} />
                </Flex>
              </Flex>
            </div>
            <div className={styles.TeamsContainer}>
              <AdaptiveAuroriansTeam
                aurorianRequirements={originCopilot.aurorian_requirements}
                readOnly
              />
            </div>

            <div
              className={styles.TeamsContainer}
              style={{ marginBottom: '.5rem' }}
            >
              <ProFormDependency name={[ensureDiffKey('auroriansReplace')]}>
                {({
                  auroriansReplace,
                }: Pick<CopilotDiffType, 'auroriansReplace'>) => {
                  const parsed = CopilotDiffSchema.pick({
                    auroriansReplace: true,
                  }).safeParse({ auroriansReplace });
                  if (parsed.success) {
                    return (
                      <>
                        <Flex
                          justify="center"
                          style={{ marginBottom: '.5rem' }}
                        >
                          <ArrowDown />
                        </Flex>
                        <AdaptiveAuroriansTeam
                          aurorianRequirements={patchAurorianRequirements(
                            originCopilot.aurorian_requirements,
                            parsed.data.auroriansReplace,
                          )}
                          readOnly
                        />
                      </>
                    );
                  }

                  return null;
                }}
              </ProFormDependency>
            </div>
            <ProFormList
              name={ensureDiffKey('auroriansReplace')}
              copyIconProps={false}
              deleteIconProps={false}
            >
              {(field, index, action) => {
                const { auroriansReplace } = form.getFieldsValue();
                const originOptions = originCopilot.aurorian_requirements
                  .filter(
                    a =>
                      !auroriansReplace?.find(
                        target => target.origin === a.aurorian_id,
                      ),
                  )
                  .map(a => {
                    const au = auroriansMap[a.aurorian_id];
                    return {
                      label: au.cn_name,
                      value: a.aurorian_id,
                    };
                  });
                return (
                  <Flex wrap={'wrap'} align="baseline" gap={4}>
                    <div>#{index + 1}</div>
                    <ProFormSelect
                      name={ensureDiffReplaceKey('origin')}
                      options={originOptions}
                      allowClear={false}
                      placeholder={'想要替换的光灵'}
                      rules={[{ required: true }]}
                    />
                    <ArrowRight />

                    <ProFormSelect
                      name={[ensureDiffReplaceKey('alter'), 'aurorianId']}
                      options={auroriansOptions}
                      showSearch
                      allowClear={false}
                      placeholder={'被替换的光灵，可拼音搜索'}
                      fieldProps={{ filterOption: filterAuroriansOption }}
                      rules={[{ required: true }]}
                    />
                    <Tooltip key="delete" title="删除此替换光灵">
                      <Button
                        style={{ marginLeft: '.3rem' }}
                        icon={<Delete />}
                        onClick={e => {
                          e.stopPropagation();
                          action.remove(field.name);
                        }}
                      />
                    </Tooltip>
                    <ProFormDependency
                      name={[ensureDiffReplaceKey('alter'), 'aurorianId']}
                    >
                      {props => {
                        if (props?.alter?.aurorianId) {
                          const aurorian = auroriansMap[props.alter.aurorianId];
                          return (
                            <ProFormRate
                              label={`${aurorian.cn_name}的光灵突破`}
                              name={[
                                ensureDiffReplaceKey('alter'),
                                'breakthrough',
                              ]}
                              fieldProps={{
                                count: aurorian.rarity,
                                allowHalf: false,
                              }}
                              rules={[{ required: true }]}
                            />
                          );
                        }
                        return null;
                      }}
                    </ProFormDependency>
                  </Flex>
                );
              }}
            </ProFormList>
            <Flex align="baseline" gap={4}>
              <ProFormDigit
                width={'xs'}
                name={ensureDiffKey('diffScore')}
                placeholder={'分数变化'}
                fieldProps={{ precision: 0 }}
                min={-originCopilot.score}
                max={5 * originCopilot.score}
              />
              <Space.Compact>
                <Button
                  onClick={() => {
                    const { diffScore } = form.getFieldsValue();
                    form.setFieldValue(
                      ensureDiffKey('diffScore'),
                      -Math.floor(originCopilot.score * 0.1) + (diffScore ?? 0),
                    );
                  }}
                >
                  分数减少 10%
                </Button>
                <Button
                  onClick={() => {
                    const { diffScore } = form.getFieldsValue();
                    form.setFieldValue(
                      ensureDiffKey('diffScore'),
                      Math.floor(originCopilot.score * 0.1) + (diffScore ?? 0),
                    );
                  }}
                >
                  增加 10%
                </Button>
              </Space.Compact>
            </Flex>
          </Flex>
        </ProForm>
      </Modal>
    );
  },
);
