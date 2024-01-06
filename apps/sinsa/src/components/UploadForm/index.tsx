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
import { useMemo, useRef } from 'react';
import { CopilotSchema } from '@sinsa/schema';
import numeral from 'numeral';
import type { FormValues } from './types';
import { CopilotnSelector } from './CopilotSelector';
import styles from './styles.module.less';
import { useVideoInfo } from './hooks/useVideoInfo';
import { VideoIframe } from './VideoIframe';
import { AURORIAN_SUMMARIES_RULES, SCORE_RULES } from './utils/rules';
import { autoSetTerm, trimBV } from './utils/preprocess';
import { useCheckVideoExist } from './hooks/useCheckVideoExist';
import { usePostCopilot } from './hooks/usePostCopilot';
import { TermsModel } from '@/models/terms';
import { FeishuModel } from '@/models/feishu';

export const UploadForm: React.FC = () => {
  const [{ termsOptions, latestTerm: currentTerm }] = useModel(TermsModel);
  const [{ isLogin }] = useModel(FeishuModel);

  const { videoInfo, loadingVideoInfo, getVideoInfo, setVideoInfo } =
    useVideoInfo();

  const { loadingCheckVideoExist, check } = useCheckVideoExist();

  const { loadingPostCopilot, postCopilotAsync } = usePostCopilot();

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
        submitButtonProps: {
          loading: loadingCheckVideoExist || loadingPostCopilot,
        },
        render: (_, dom) => (
          <FooterToolbar className={styles.FootBar}>{dom}</FooterToolbar>
        ),
        searchConfig: {
          // eslint-disable-next-line no-nested-ternary
          submitText: loadingCheckVideoExist
            ? '校验重复中'
            : loadingPostCopilot
            ? '提交中'
            : '提交作业',
        },
      }}
      onFinish={async (values: FormValues) => {
        console.log('开始提交', values);

        try {
          const submitCopilot = await CopilotSchema.parseAsync(values);
          const result = await postCopilotAsync(submitCopilot);

          if (result?.record?.record_id) {
            notification.success({
              message: `醒山小狗已经成功帮您添加了一份作业，record_id 为 ${result?.record?.record_id}`,
            });
            formRef.current?.resetFields();
            setVideoInfo(undefined);
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
            if (typeof nextTerm === 'number') {
              autoSetTerm(formRef.current, nextTerm);
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
              fieldProps={{
                onChange(e) {
                  const bvOrLink = e.target.value;
                  trimBV(formRef.current, bvOrLink);
                },
              }}
              rules={[
                { required: true },
                { pattern: /^BV.+$/, message: 'BV号格式不正确' },
                {
                  async validator(_, bv) {
                    if (typeof bv === 'string' && bv.startsWith('BV')) {
                      const result = await check({ bv, term });
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
                disabled={
                  !isLogin || !(typeof bv === 'string' && bv.startsWith('BV'))
                }
                type="primary"
                loading={loadingVideoInfo}
                onClick={async e => {
                  e.stopPropagation();
                  const result = await getVideoInfo(bv);

                  if (result) {
                    const { title, desc, owner, pubdate } = result;
                    formRef.current?.setFieldsValue({
                      title,
                      description: desc === '-' ? undefined : desc,
                      author: owner.name,
                      upload_time: pubdate.valueOf(),
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
      <VideoIframe bvid={videoInfo?.bvid} />

      <ProForm.Item
        label="光灵阵容"
        name="aurorian_summaries"
        rules={AURORIAN_SUMMARIES_RULES}
      >
        <CopilotnSelector />
      </ProForm.Item>

      <ProFormDigit
        label="结算分数"
        name="score"
        validateTrigger="onBlur"
        rules={SCORE_RULES}
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
