import type {
  CopilotNextType,
  FeishuCopilotType,
  TermNextType,
} from '@sinsa/schema';
import {
  AurorianNextSchema,
  CopilotNextSchema,
  TermNextSchema,
} from '@sinsa/schema';
import { isPlainObject, mapValues, once } from 'lodash-es';
import axios from 'axios';
import { FeishuProfileSchema } from '@/schemas/feishu-profile';
import { BilibiliVideoDetailSchema } from '@/schemas/bilibili-video-detail';
import type { FeishuAccessTokenType } from '@/schemas/feishu-access-token';
import { FeishuAccessTokenSchema } from '@/schemas/feishu-access-token';
import { LOCAL_STORAGE_ACCESS_TOKEN } from '@/views/UploadView/LarkLoginCard/constants';

const http = axios.create({});

const httpWithToken = axios.create({});

httpWithToken.interceptors.request.use(
  async config => {
    const content = window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    const tokenInfo = FeishuAccessTokenSchema.parse(
      content ? JSON.parse(content) : null,
    );
    config.headers = {
      Authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`,
      'Content-Type': 'application/json',
    } as any;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
// Response interceptor for API calls
httpWithToken.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    const content = window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    const tokenInfo = FeishuAccessTokenSchema.parse(
      content ? JSON.parse(content) : null,
    );
    const now = Date.now();
    if (now > tokenInfo.startTime + tokenInfo.refresh_expires_in * 1000) {
      return Promise.reject(error);
    }

    if (now > tokenInfo.startTime + tokenInfo.expires_in * 1000) {
      if (error.response.status !== 200 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newTokenInfo = await refreshFeishuToken({
          refresh_token: tokenInfo.refresh_token,
        });
        if (newTokenInfo) {
          originalRequest.headers.Authorization = `${newTokenInfo.token_type} ${newTokenInfo.access_token}`;
          return httpWithToken(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  },
);

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
export async function getFeishuAccessToken(body: {
  code: string;
}): Promise<FeishuAccessTokenType | undefined> {
  const now = Date.now();
  try {
    const response = await http.post('/api-worker/feishu/access-token', body);
    if (response.data?.code === 0) {
      const result = FeishuAccessTokenSchema.parse({
        ...response.data.data,
        startTime: now,
      });
      window.localStorage.setItem(
        LOCAL_STORAGE_ACCESS_TOKEN,
        JSON.stringify(result),
      );
      return result;
    }
  } catch (error) {}
  return undefined;
}

/**
 * 授权回调
 */
export async function refreshFeishuToken(body: {
  refresh_token: string;
}): Promise<FeishuAccessTokenType | undefined> {
  const now = Date.now();
  try {
    const response = await http.post('/api-worker/feishu/refresh-token', body);
    if (response.data?.code === 0) {
      const result = FeishuAccessTokenSchema.parse({
        ...response.data?.data,
        startTime: now,
      });
      window.localStorage.setItem(
        LOCAL_STORAGE_ACCESS_TOKEN,
        JSON.stringify(result),
      );
      return result;
    }
  } catch (error) {}
  return undefined;
}

/**
 * 获取当前登录的飞书用户状态信息
 */
export const getFeishuProfile = once(async function getFeishuProfile() {
  try {
    const response = await httpWithToken.get('/api-worker/feishu/profile');
    if (response.data?.code === 0) {
      return FeishuProfileSchema.parse(response.data?.data);
    }
  } catch (error) {}
  return undefined;
});

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
export async function postCopilot(
  remoteCopilot: Omit<FeishuCopilotType, 'created_time' | 'created_by'>,
) {
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
    const response = await httpWithToken.get(
      '/api-worker/bilibili/latest-videos',
    );
    if (
      response.data?.code === 0 &&
      Array.isArray(response.data?.data?.result)
    ) {
      return response.data?.data;
    }
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
    const response = await httpWithToken.get(
      '/api-worker/feishu/latest-copilots',
      {
        params,
      },
    );
    if (response.data?.code === 0 && Array.isArray(response.data?.data)) {
      return response.data?.data;
    }
  } catch (error) {}
  return undefined;
}
