import { AurorianSchema, CopilotSchema, TermSchema } from '@sinsa/schema';
import type { CopilotType, TermType } from '@sinsa/schema';
import { isPlainObject, mapValues } from 'lodash-es';
import axios from 'axios';
import { FeishuProfileSchema } from '@/schemas/feishu-profile';
import { BilibiliVideoDetailSchema } from '@/schemas/bilibili-video-detail';
import type { toInputRemoteCopilot } from '@/components/UploadForm/utils/toInputRemoteCopilot';

const http = axios.create({});

/**
 * 获取荒典首领信息
 */
export async function getTerms() {
  try {
    const response = await http.get('/api/terms.json');
    if (
      Array.isArray(response.data) &&
      response.data.every(item => TermSchema.parse(item))
    ) {
      return response.data as TermType[];
    }
  } catch (error) {}
  return [];
}

/**
 * 获取光灵信息
 */
export async function getAurorians() {
  try {
    const response = await http.get('/api/aurorians.json');
    if (isPlainObject(response.data)) {
      return mapValues(response.data, v => AurorianSchema.parse(v));
    }
  } catch (error) {}
  return {};
}

/**
 * 获取作业
 */
export async function getCopilots(
  term: number | `${number}`,
): Promise<Record<CopilotType['bv'], CopilotType>> {
  const response = await http.get(`/api/copilots/${term}.json`, {
    headers: { 'Cache-Control': 'no-cache' },
  });
  if (isPlainObject(response.data)) {
    return mapValues(response.data, v => CopilotSchema.parse(v));
  }
  return {};
}

/**
 * 授权回调
 */
export async function saveAuthCallback(params: { code: string }) {
  try {
    const response = await http.get('/api-upload/lark/auth-callback', {
      params,
    });
    console.log('callback', response);
  } catch (error) {}
}

/**
 * 获取当前登录的飞书用户状态信息
 */
export async function getFeishuProfile() {
  try {
    const response = await http.get('/api-upload/lark/profile', {});
    if (response.data) {
      return FeishuProfileSchema.parse(response.data);
    }
  } catch (error) {}
  return undefined;
}

/**
 * 获取 B 站视频信息
 * @param bv 视频 BV 号
 * @returns 视频信息
 */
export async function getVideoInfo(bv: string) {
  try {
    const response = await http.get(`/api-upload/btv/video/${bv}`);
    if (response.data) {
      return BilibiliVideoDetailSchema.parse(response.data);
    }
  } catch (error) {
    console.log('error', error);
  }
  return undefined;
}

/**
 * 判断 B 站视频是否已经收录
 * @param params.bv B 站视频 BV 号
 * @param params.term 检查期数
 * @returns
 */
export async function checkVideoExist(params: {
  bv: string;
  term: string | number;
}) {
  try {
    const response = await http.get('/api-upload/lark/check', {
      params,
    });
    if (response.data) {
      return response.data;
    }
  } catch (error) {}
  return undefined;
}

/**
 * 提交作业
 * @param remoteCopilot 远程作业适配类型
 * @returns 提交结果
 */
export async function postCopilot(
  remoteCopilot: ReturnType<typeof toInputRemoteCopilot>,
) {
  try {
    const response = await http.post('/api-upload/lark/copilot', remoteCopilot);
    return response.data;
  } catch (error) {}
  return undefined;
}
