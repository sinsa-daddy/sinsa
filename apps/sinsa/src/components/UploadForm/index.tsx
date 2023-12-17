import {
  ProForm,
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useModel } from '@modern-js/runtime/model';
import dayjs from 'dayjs';
import { Button, notification } from 'antd';
import { useRequest } from 'ahooks';
import { useRef, useState } from 'react';
import { CopilotAurorianSummaryType, CopilotSchema } from '@sinsa/schema';
import { LARK_ORIGIN } from '../LarkLoginCard/constants';
import type { BilibiliVideoType } from './types';
import { CopilotnSelector } from './CopilotSelector';
import { toInputRemoteCopilot } from './utils/toInputRemoteCopilot';
import { TermsModel } from '@/models/terms';
import { AuroriansModel } from '@/models/aurorians';

interface FormValues {
  term: number;
  bv: `BV${string}`;
  duplicate: boolean;
  title: string;
  description: string;
  author: string;
  upload_time: number;
  score: number;
  aurorian_summaries: [
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
  ];
}

export const UploadForm: React.FC = () => {
  const [{ termsOptions, firstTerm, termsMap }] = useModel(TermsModel);
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

  const formRef = useRef<ProFormInstance<FormValues>>();

  return (
    <ProForm<FormValues>
      formRef={formRef}
      // loading={loadingValidateBV}
      onFinish={async (values: unknown) => {
        const parsed = CopilotSchema.safeParse(values);
        if (parsed.success) {
          const result = await fetch(`${LARK_ORIGIN}/lark/copilot`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify(
              toInputRemoteCopilot(parsed.data, { termsMap, auroriansMap }),
            ),
            headers: {
              'Content-Type': 'application/json',
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
          }).then(res => res.json());

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
            console.log('upload failed', result, parsed);
          }
        } else {
          notification.error({
            message: `解析表单失败 ${JSON.stringify(values, null, 2)}`,
          });
        }
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          name="term"
          label="荒典期数"
          options={termsOptions}
          initialValue={firstTerm?.term}
          rules={[{ required: true }]}
          width={'sm'}
        />
        <ProFormDependency name={['term']}>
          {({ term }) => (
            <ProFormText
              name="bv"
              label="BV号"
              placeholder={'BVXXXXXXX'}
              validateTrigger="onBlur"
              width={'md'}
              // initialValue={'BV1Q64y1V7jc'}
              rules={[
                { required: true },
                { pattern: /^BV.+$/, message: 'BV号格式不正确' },
                {
                  async validator(_, bv) {
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
                        throw new Error(
                          `${
                            result?.target?.fields?.creator?.name
                          } 已经在 ${dayjs(
                            result?.target?.fields?.insert_db_time,
                          ).format('YYYY-MM-DD HH:mm:ss')} 添加了此作业`,
                        );
                      }
                    }
                    setLoadingValidateBV(false);
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
                disabled={!bv}
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
                读取视频基础信息
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
        rules={[{ required: true }]}
        min={0}
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
