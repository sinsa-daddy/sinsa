import { Client, isFullPage, iteratePaginatedAPI } from '@notionhq/client';
import type { AurorianNextType } from '@sinsa/schema';
import { difference } from 'lodash';
import Downloader from 'nodejs-file-downloader';
import { logger } from '../logger';
import type {
  DownloadAvatarConfig,
  NotionClientOptions,
  SumbmitAuroriansOptions,
} from './types';
import { getContentFromRichText } from './helpers/get-content';
import { getAuroriansSource } from './apis/get-aurorians-source';
import { toAurorian } from './helpers/to-aurorian';

export class NotionService {
  private readonly _client: Client;

  private readonly _databaseIds: NotionClientOptions['databaseIds'];

  constructor({ notionToken, databaseIds }: NotionClientOptions) {
    this._client = new Client({
      auth: notionToken,
    });
    this._databaseIds = databaseIds;
  }

  /**
   * 从 notion 光灵数据库获取数据
   */
  async getAuroriansMap() {
    const auroriansMap: Record<string, AurorianNextType> = {};

    for await (const page of iteratePaginatedAPI(this._client.databases.query, {
      database_id: this._databaseIds.aurorians,
      page_size: 150,
    })) {
      if (isFullPage(page)) {
        const aurorian = toAurorian(page);
        auroriansMap[aurorian.aurorian_id] = aurorian;
      } else {
        break;
      }
    }

    return auroriansMap;
  }

  /**
   * 将远程光灵数据上传到 notion
   */
  async submitAurorianDatabase({
    downloadAvatar,
  }: SumbmitAuroriansOptions = {}) {
    /**
     * 获取的远端光灵数据集合
     */
    const {
      auroriansMap: remoteAuroriansMap,
      avatarURLMap: remoteAvatarURLMap,
    } = await getAuroriansSource();
    const remoteAurorianIds = Object.keys(remoteAuroriansMap);

    /**
     * 获取 notion 光灵数据库中所有光灵的 id 集合
     */
    const notionAurorianIds: AurorianNextType['aurorian_id'][] = [];
    for await (const page of iteratePaginatedAPI(this._client.databases.query, {
      database_id: this._databaseIds.aurorians,
      filter_properties: ['title'],
      page_size: 100,
    })) {
      if (isFullPage(page)) {
        const titleProperty = page.properties?.aurorian_id;
        if (titleProperty.type === 'title') {
          const id = getContentFromRichText(titleProperty.title);
          if (typeof id === 'string') {
            notionAurorianIds.push(id);
          }
        }
      }
    }

    /**
     * notion 中需要新增的光灵 id 集合
     */
    const diffAurorianIds = difference(remoteAurorianIds, notionAurorianIds);
    logger.info(
      `find new ${diffAurorianIds.length} aurorians`,
      diffAurorianIds,
    );

    // 记录下实际上传到 notion 的光灵 id
    const actualAurorianIds: AurorianNextType['aurorian_id'][] = [];

    // 上传新增的光灵到 notion
    for (const diffAurorianId of diffAurorianIds) {
      const targetAurorian = remoteAuroriansMap[diffAurorianId];
      if (targetAurorian) {
        await this._insertAurorianToNotion(
          targetAurorian,
          downloadAvatar
            ? { ...downloadAvatar, remoteAvatarURLMap }
            : undefined,
        );
        actualAurorianIds.push(targetAurorian.aurorian_id);
      }
    }

    return {
      actualAurorianIds,
    };
  }

  private async _insertAurorianToNotion(
    aurorian: AurorianNextType,
    downloadAvatar?: DownloadAvatarConfig & {
      remoteAvatarURLMap: Record<AurorianNextType['aurorian_id'], string>;
    },
  ) {
    const response = await this._client.pages.create({
      parent: {
        database_id: this._databaseIds.aurorians,
      },
      properties: {
        aurorian_id: {
          type: 'title',
          title: [{ type: 'text', text: { content: aurorian.aurorian_id } }],
        },
        name: {
          type: 'rich_text',
          rich_text: [
            {
              type: 'text',
              text: { content: aurorian.name },
            },
          ],
        },
        cn_name: {
          type: 'rich_text',
          rich_text: [
            {
              type: 'text',
              text: { content: aurorian.cn_name },
            },
          ],
        },
        primary_element: {
          type: 'select',
          select: {
            name: aurorian.primary_element,
          },
        },
        secondary_element: {
          type: 'select',
          select: aurorian.secondary_element
            ? {
                name: aurorian.secondary_element,
              }
            : null,
        },
        profession: {
          type: 'select',
          select: {
            name: aurorian.profession,
          },
        },
        rarity: {
          type: 'number',
          number: aurorian.rarity,
        },
      },
    });

    if (isFullPage(response)) {
      logger.info(
        `The aurorian ${aurorian.name}(${aurorian.cn_name}) is added.`,
      );
      if (downloadAvatar) {
        await this._downloadAvatars({
          baseURL: downloadAvatar.baseURL,
          directory: downloadAvatar.directory,
          slug: aurorian.aurorian_id,
          filename: downloadAvatar.remoteAvatarURLMap[aurorian.aurorian_id],
        });
      }
    } else {
      throw new Error(`failed to add aurorian: ${aurorian.name}`);
    }
  }

  private async _downloadAvatars({
    baseURL,
    directory,
    slug,
    filename,
  }: DownloadAvatarConfig & { slug: string; filename: string }) {
    const downloader = new Downloader({
      url: `${baseURL.replace(/\/$/, '')}/${filename}`,
      directory,
      fileName: `${slug}.webp`,
      maxAttempts: 2,
    });

    const { filePath, downloadStatus } = await downloader.download(); // Downloader.download() resolves with some useful properties.

    if (downloadStatus === 'COMPLETE') {
      logger.log(`The avatar(${slug}) is downloaded in the path: ${filePath}`);
    }
  }
}
