/* eslint-disable max-lines */
import {
  FooterToolbar,
  ProForm,
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useModel } from '@modern-js/runtime/model';
import dayjs from 'dayjs';
import { Button, Card, Typography, notification } from 'antd';
import { useMemo } from 'react';
import numeral from 'numeral';
import { CopilotNextSchema, CopilotSourceType } from '@sinsa/schema';
import { LatestVideoCard, useLatestVideoCardRef } from '../LatestVideoCard';
import type { FormValues } from './types';
import { CopilotnSelector } from './CopilotSelector';
import styles from './styles.module.less';
import { useVideoInfo } from './hooks/useVideoInfo';
import { VideoIframe } from './VideoIframe';
import { AURORIAN_SUMMARIES_RULES, SCORE_RULES } from './utils/rules';
import { trimBV } from './utils/preprocess';
import { useCheckVideoExist } from './hooks/useCheckVideoExist';
import { usePostCopilot } from './hooks/usePostCopilot';
import { ensureKey } from './utils/ensure';
import { getCopilotId } from './utils/get-copilot-id';
import { TermsModel } from '@/models/terms';
import { FeishuModel } from '@/models/feishu';

const SourceTypeOptions = [
  {
    label: '哔哩哔哩',
    value: CopilotSourceType.Bilibili,
  },
  {
    label: 'Youtube',
    value: CopilotSourceType.Youtube,
    disabled: true,
  },
];

export const UploadForm: React.FC = () => {
  const [{ termsOptions, latestTerm }] = useModel(TermsModel);
  const [{ isLogin }] = useModel(FeishuModel);

  const { videoInfo, loadingVideoInfo, getVideoInfo, setVideoInfo } =
    useVideoInfo();

  const { loadingCheckVideoExist, check } = useCheckVideoExist();

  const { loadingPostCopilot, postCopilotAsync } = usePostCopilot();

  const [form] = ProForm.useForm<FormValues>();

  const initialValues: Partial<FormValues> = useMemo(() => {
    const result: Partial<FormValues> = {
      source_type: CopilotSourceType.Bilibili,
    };
    if (latestTerm?.term_id) {
      result.term_id = latestTerm.term_id;
    }
    return result;
  }, [latestTerm?.term_id]);

  const latestVideoCardRef = useLatestVideoCardRef();

  return (
    <>
      <LatestVideoCard
        currentTermId={form.getFieldValue(ensureKey('term_id'))}
        ref={latestVideoCardRef}
        onClickNewCard={bvid => {
          form.setFieldValue(ensureKey('href'), bvid);
        }}
      />
      {isLogin ? (
        <Card>
          <ProForm<FormValues>
            form={form}
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
              const submitValues = {
                ...values,
                copilot_id: getCopilotId(values),
              };

              console.log('开始提交', submitValues);

              try {
                const submitCopilot = await CopilotNextSchema.omit({
                  created_by: true,
                  created_time: true,
                }).parseAsync(submitValues);
                const result = await postCopilotAsync(submitCopilot);

                if (result?.record?.record_id) {
                  notification.success({
                    message: `醒山小狗已经成功帮您添加了 ${result?.record?.fields?.author_name} 的一份作业, record_id 为 ${result?.record?.record_id}`,
                  });
                  form.resetFields();
                  setVideoInfo(undefined);
                  latestVideoCardRef.current?.refresh();
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
                name={ensureKey('term_id')}
                label="荒典期数"
                options={termsOptions}
                rules={[{ required: true }]}
                width={'sm'}
                showSearch={false}
              />
              <ProFormRadio.Group
                name={ensureKey('source_type')}
                label="投稿平台"
                radioType="button"
                options={SourceTypeOptions}
                rules={[{ required: true }]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormDependency name={[ensureKey('term_id')]}>
                {({ term_id }) => (
                  <ProFormText
                    name={ensureKey('href')}
                    label="BV号或B站视频链接"
                    placeholder={
                      'BVxxxxxxxxxx 或 https://www.bilibili.com/video/BVxxxxxxxxxx/'
                    }
                    validateTrigger="onBlur"
                    width={'lg'}
                    fieldProps={{
                      onChange(e) {
                        const bvOrLink = e.target.value;
                        trimBV(form, bvOrLink);
                      },
                    }}
                    rules={[
                      { required: true },
                      { pattern: /^BV.+$/, message: 'BV号格式不正确' },
                      {
                        async validator(_, bv) {
                          if (typeof bv === 'string' && bv.startsWith('BV')) {
                            const result = await check({
                              href: bv,
                              termId: term_id,
                            });
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
                    extra="小提示：点击上方未收录的视频卡片，能快速填入 BV 号"
                  />
                )}
              </ProFormDependency>
              <ProForm.Item label=" ">
                <ProFormDependency name={[ensureKey('href')]}>
                  {({ href }) => (
                    <Button
                      disabled={
                        !isLogin ||
                        !(typeof href === 'string' && href.startsWith('BV'))
                      }
                      type="primary"
                      loading={loadingVideoInfo}
                      onClick={async e => {
                        e.stopPropagation();
                        const result = await getVideoInfo(href);

                        if (result) {
                          const { title, desc, owner, pubdate } = result;
                          form.setFieldsValue({
                            title,
                            description: desc === '-' ? undefined : desc,
                            author_id: String(owner.mid),
                            author_name: owner.name,
                            upload_time: pubdate.valueOf(),
                          });
                        }
                      }}
                    >
                      读取哔哩哔哩投稿视频信息
                    </Button>
                  )}
                </ProFormDependency>
              </ProForm.Item>
            </ProForm.Group>
            <VideoIframe bvid={videoInfo?.bvid} />

            <ProForm.Item
              label="光灵阵容"
              name={ensureKey('aurorian_requirements')}
              rules={AURORIAN_SUMMARIES_RULES}
            >
              <CopilotnSelector />
            </ProForm.Item>

            <ProFormDigit
              label="结算分数"
              name={ensureKey('score')}
              validateTrigger="onBlur"
              rules={SCORE_RULES}
              min={0}
              fieldProps={{
                formatter: value => numeral(value).format('0,0'),
                parser: str => numeral(str).value() ?? 0,
                size: 'large',
              }}
              extra={
                <ProFormDependency name={[ensureKey('score')]}>
                  {partialValues => {
                    const { score } = partialValues as Pick<
                      FormValues,
                      'score'
                    >;
                    if (
                      latestVideoCardRef.current?.latestMaxAndMinScoreCopilots
                        ?.maxScoreCopilot &&
                      latestVideoCardRef.current?.latestMaxAndMinScoreCopilots
                        .minScoreCopilot
                    ) {
                      if (
                        score >=
                        2 *
                          latestVideoCardRef.current
                            .latestMaxAndMinScoreCopilots.maxScoreCopilot.score
                      ) {
                        return (
                          <Typography.Text type="warning">
                            录入的分数超过最近作业最高分两倍，请再次确认是否录入正确
                          </Typography.Text>
                        );
                      }

                      if (
                        score <=
                        0.5 *
                          latestVideoCardRef.current
                            .latestMaxAndMinScoreCopilots.minScoreCopilot.score
                      ) {
                        return (
                          <Typography.Text type="warning">
                            录入的分数低于最近作业最低分的一半，请再次确认是否录入正确
                          </Typography.Text>
                        );
                      }
                    }

                    return null;
                  }}
                </ProFormDependency>
              }
            />

            <ProFormText
              label="视频标题"
              name={ensureKey('title')}
              rules={[{ required: true }]}
            />

            <ProForm.Group>
              <ProFormDateTimePicker
                label="视频发布时间"
                name={ensureKey('upload_time')}
                rules={[{ required: true }]}
              />
              <ProFormText
                label="作业作者"
                name={ensureKey('author_name')}
                rules={[{ required: true }]}
              />
              <ProFormText
                label="作业作者空间 ID"
                name={ensureKey('author_id')}
                rules={[{ required: true }]}
                placeholder={`space.bilibili.com/[这一段数字填进来]`}
                width={'md'}
              />
              <ProFormTextArea
                label="视频描述"
                name="description"
                width={'xl'}
              />
            </ProForm.Group>
          </ProForm>
        </Card>
      ) : null}
    </>
  );
};
