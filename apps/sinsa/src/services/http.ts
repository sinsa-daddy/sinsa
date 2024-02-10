import type { CopilotNextType, TermNextType } from '@sinsa/schema';
import {
  AurorianNextSchema,
  CopilotNextSchema,
  TermNextSchema,
} from '@sinsa/schema';
import { isPlainObject, mapValues } from 'lodash-es';
import axios from 'axios';
import type { FeishuCopilotType } from '@sinsa/datasource-generator/dist/types/services/feishu/schema/feishu-copilot';
import { FeishuProfileSchema } from '@/schemas/feishu-profile';
import { BilibiliVideoDetailSchema } from '@/schemas/bilibili-video-detail';

const http = axios.create({});

/**
 * 获取荒典首领信息
 */
export async function getTerms() {
  try {
    const response = await http.get('/api/v2/terms.json');
    if (Array.isArray(response.data)) {
      return response.data.map(item =>
        TermNextSchema.parse(item),
      ) as TermNextType[];
    }
  } catch (error) {}
  return [];
}

/**
 * 获取光灵信息
 */
export async function getAurorians() {
  try {
    const response = await http.get('/api/v2/aurorians.json');
    if (isPlainObject(response.data)) {
      return mapValues(response.data, v => AurorianNextSchema.parse(v));
    }
  } catch (error) {}
  return {};
}

/**
 * 获取作业
 */
export async function getCopilots(
  termId: TermNextType['term_id'],
): Promise<Record<CopilotNextType['copilot_id'], CopilotNextType>> {
  const response = await http.get(`/api/v2/copilots/${termId}.json`, {
    headers: { 'Cache-Control': 'no-cache' },
  });
  if (isPlainObject(response.data)) {
    return mapValues(response.data, v => CopilotNextSchema.parse(v));
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
      return BilibiliVideoDetailSchema.parse({
        ...response.data,
        pubdate: response.data.pubdate * 1000,
      });
    }
  } catch (error) {
    console.log('error', error);
  }
  return undefined;
}

/**
 * 判断 B 站视频是否已经收录
 * @returns
 */
export async function checkVideoExist(params: {
  href: string;
  termId: string;
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
export async function postCopilot(remoteCopilot: FeishuCopilotType) {
  try {
    const response = await http.post('/api-upload/lark/copilot', remoteCopilot);
    return response.data;
  } catch (error) {}
  return undefined;
}

/**
 * 获取最近的 B 站作业收录情况
 * @returns
 */
export async function getLatestVideo() {
  try {
    const response = await http.get('/api-upload/btv/latest');
    return response.data;
  } catch (error) {}
  return undefined;
}

/**
 * 获取最近的 数据库 作业收录情况
 * @param params.pageSize 读取飞书数据库中最近作业条目
 * @returns
 */
export async function getLatestCopilots(params: { pageSize: number }) {
  try {
    const response = await http.get('/api-upload/lark/latestCopilots', {
      params,
    });
    return response.data;
  } catch (error) {}
  return undefined;
}
