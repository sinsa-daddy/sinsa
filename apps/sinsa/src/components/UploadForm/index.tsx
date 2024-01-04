import type { ProFormInstance } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ProForm,
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useModel } from '@modern-js/runtime/model';
import dayjs from 'dayjs';
import { Button, notification } from 'antd';
import { useRequest } from 'ahooks';
import { useMemo, useRef, useState } from 'react';
import type { CopilotType } from '@sinsa/schema';
import { CopilotSchema } from '@sinsa/schema';
import numeral from 'numeral';
import { LARK_ORIGIN } from '../LarkLoginCard/constants';
import type { BilibiliVideoType, FormValues } from './types';
import { CopilotnSelector } from './CopilotSelector';
import { toInputRemoteCopilot } from './utils/toInputRemoteCopilot';
import styles from './styles.module.less';
import { TermsModel } from '@/models/terms';
import { AuroriansModel } from '@/models/aurorians';

export const UploadForm: React.FC = () => {
  const [{ termsOptions, latestTerm: currentTerm, termsMap }] =
    useModel(TermsModel);
  const [{ auroriansMap }] = useModel(AuroriansModel);

  const { data, loading, runAsync, mutate } = useRequest(
    async bv => {
      const result = await fetch(`${LARK_ORIGIN}/btv/video/${bv}`, {
        mode: 'cors',
        credentials: 'include',
      }).then(res => res.json());
      return result as BilibiliVideoType | undefined;
    },
    { manual: true },
  );

  const [loadingValidateBV, setLoadingValidateBV] = useState(false);

  const { loading: loadingSubmit, runAsync: submitAsync } = useRequest(
    async (submitCopilot: CopilotType) => {
      const result = await fetch(`${LARK_ORIGIN}/lark/copilot`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(
          toInputRemoteCopilot(submitCopilot, { termsMap, auroriansMap }),
        ),
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(res => res.json());

      return result;
    },
    { manual: true },
  );

  const formRef = useRef<ProFormInstance<FormValues>>();

  const initialValues: Partial<FormValues> = useMemo(() => {
    const result: Partial<FormValues> = {};
    if (currentTerm?.term) {
      result.term = currentTerm.term;
    }
    return result;
  }, [currentTerm?.term]);

  return (
    <ProForm<FormValues>
      formRef={formRef}
      initialValues={initialValues}
      submitter={{
        submitButtonProps: { loading: loadingValidateBV || loadingSubmit },
        render: (_, dom) => (
          <FooterToolbar className={styles.FootBar}>{dom}</FooterToolbar>
        ),
        searchConfig: {
          // eslint-disable-next-line no-nested-ternary
          submitText: loadingValidateBV
            ? '校验重复中'
            : loadingSubmit
            ? '提交中'
            : '提交作业',
        },
      }}
      onFinish={async (values: FormValues) => {
        console.log('开始提交', values);

        try {
          const submitCopilot = await CopilotSchema.parseAsync(values);
          const result = await submitAsync(submitCopilot);

          if (result?.record?.record_id) {
            notification.success({
              message: `醒山小狗已经成功帮您添加了一份作业，record_id 为 ${result?.record?.record_id}`,
            });
            formRef.current?.resetFields();
            mutate(undefined);
          } else {
            notification.error({
              message: `没有上传成功 ${JSON.stringify(result, null, 2)}`,
            });
            console.log('upload failed', result, submitCopilot);
          }
        } catch (error) {
          notification.error({
            message: `解析表单失败 ${JSON.stringify(error, null, 2)}`,
          });
          console.error('解析失败', error);
        }
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          name="term"
          label="荒典期数"
          options={termsOptions}
          rules={[{ required: true }]}
          width={'sm'}
          showSearch={false}
          onChange={nextTerm => {
            if (nextTerm === 14) {
              formRef.current?.setFieldValue('rerun_terms', [24]);
            } else {
              formRef.current?.setFieldValue('rerun_terms', undefined);
            }
          }}
        />
        <ProFormSelect
          name="rerun_terms"
          label="可被复用荒典期数"
          options={termsOptions}
          width={'md'}
          showSearch={false}
          fieldProps={{ mode: 'multiple' }}
          tooltip="例如第 14 期荒典作业可被第 24 期荒典复用, 那么上一个选项荒典期数选择 14 期，此选项可被复用荒典期数选择 24 期"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDependency name={['term']}>
          {({ term }) => (
            <ProFormText
              name="bv"
              label="BV号或B站视频链接"
              placeholder={
                'BVxxxxxxxxxx 或 https://www.bilibili.com/video/BVxxxxxxxxxx/'
              }
              validateTrigger="onBlur"
              width={'lg'}
              // initialValue={'BV1Q64y1V7jc'}
              fieldProps={{
                onChange(e) {
                  const bvOrLink = e.target.value;
                  if (
                    typeof bvOrLink === 'string' &&
                    (bvOrLink.startsWith('https://') ||
                      bvOrLink.startsWith('http://'))
                  ) {
                    const bvResult = /\/(BV[^/]+)\/?/.exec(
                      new URL(bvOrLink).pathname,
                    )?.[1];
                    if (
                      typeof bvResult === 'string' &&
                      bvResult.startsWith('BV')
                    ) {
                      formRef.current?.setFieldValue('bv', bvResult);
                    }
                  }
                  return undefined;
                },
              }}
              rules={[
                { required: true },
                { pattern: /^BV.+$/, message: 'BV号格式不正确' },
                {
                  async validator(_, bv) {
                    console.log('bv', bv);
                    if (typeof bv === 'string' && bv.startsWith('BV')) {
                      setLoadingValidateBV(true);
                      const result = await fetch(
                        `${LARK_ORIGIN}/lark/check?bv=${bv}&term=${term}`,
                        {
                          mode: 'cors',
                          credentials: 'include',
                        },
                      ).then(res => res.json());
                      if (result?.noExist || result?.target) {
                        if (result?.target) {
                          const errorMessage = `${
                            result?.target?.fields?.creator?.name
                          } 已经在 ${dayjs(
                            result?.target?.fields?.insert_db_time,
                          ).format('YYYY-MM-DD HH:mm:ss')} 添加了此作业`;
                          notification.error({
                            message: `${errorMessage}. 撞车了~ 请更换作业收录`,
                          });
                          throw new Error(errorMessage);
                        }
                      }
                      setLoadingValidateBV(false);
                    }
                  },
                },
              ]}
            />
          )}
        </ProFormDependency>
        <ProForm.Item label=" ">
          <ProFormDependency name={['bv']}>
            {({ bv }) => (
              <Button
                disabled={!(typeof bv === 'string' && bv.startsWith('BV'))}
                type="primary"
                loading={loading}
                onClick={async e => {
                  e.stopPropagation();
                  const result = await runAsync(bv);
                  console.log('result', result);
                  if (result) {
                    const { title, desc, owner, pubdate } = result;
                    formRef.current?.setFieldsValue({
                      title,
                      description: desc === '-' ? undefined : desc,
                      author: owner.name,
                      upload_time: pubdate * 1000,
                    });
                  }
                }}
              >
                读取视频信息
              </Button>
            )}
          </ProFormDependency>
        </ProForm.Item>
      </ProForm.Group>
      {data ? (
        <>
          <iframe
            src={`//player.bilibili.com/player.html?bvid=${data.bvid}`}
            scrolling="no"
            frameBorder="no"
            style={{ border: 0, width: 700, height: 420 }}
          ></iframe>
        </>
      ) : null}

      <ProForm.Item
        label="光灵阵容"
        name="aurorian_summaries"
        rules={[
          {
            async validator(_, array) {
              if (Array.isArray(array) && array.length === 5) {
                // pass
              } else {
                throw new Error('光灵阵容搭配不正确');
              }
            },
          },
          { required: true },
        ]}
      >
        <CopilotnSelector />
      </ProForm.Item>

      <ProFormDigit
        label="结算分数"
        name="score"
        validateTrigger="onBlur"
        rules={[
          { required: true },
          {
            async validator(_, value) {
              if (
                typeof value === 'number' &&
                Number.isInteger(value) &&
                value > 0
              ) {
                // pass
              } else {
                throw new Error('分数必须是正整数');
              }

              if (value >= 1e8) {
                throw new Error('分数大于一亿分了，你要不再看看有没有填对？');
              } else if (value <= 1e5) {
                throw new Error('分数小于十万分，你要不要再看看有没有填对？');
              }
            },
          },
        ]}
        min={0}
        fieldProps={{
          formatter: value => numeral(value).format('0,0'),
          parser: str => numeral(str).value() ?? 0,
          size: 'large',
        }}
      />

      <ProFormText label="视频标题" name="title" rules={[{ required: true }]} />

      <ProForm.Group>
        <ProFormDateTimePicker
          label="视频发布时间"
          name={'upload_time'}
          rules={[{ required: true }]}
        />
        <ProFormText
          label="作业作者"
          name={'author'}
          rules={[{ required: true }]}
        />
        <ProFormTextArea label="视频描述" name="description" width={'xl'} />
      </ProForm.Group>
    </ProForm>
  );
};
