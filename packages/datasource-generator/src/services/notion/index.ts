import { Client, isFullPage, iteratePaginatedAPI } from '@notionhq/client';
import type { AurorianNextType } from '@sinsa/schema';
import { difference } from 'lodash';
import { logger } from '../logger';
import type {
  NotionClientOptions,
  SubmitAurorianDatabaseOptions,
} from './types';
import { getContentFromRichText } from './helpers/get-content';
import { getAuroriansSource } from './apis/get-aurorians-source';

export class NotionService {
  private _client: Client;

  constructor({ notionToken }: NotionClientOptions) {
    this._client = new Client({
      auth: notionToken,
    });
  }

  async submitAurorianDatabase({ databaseId }: SubmitAurorianDatabaseOptions) {
    /**
     * 获取的远端光灵数据集合
     */
    const remoteAuroriansMap = await getAuroriansSource();
    const remoteAurorianIds = Object.keys(remoteAuroriansMap);

    /**
     * 获取 notion 光灵数据库中所有光灵的 id 集合
     */
    const notionAurorianIds: AurorianNextType['aurorian_id'][] = [];
    for await (const page of iteratePaginatedAPI(this._client.databases.query, {
      database_id: databaseId,
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

    const diffAurorianIds = difference(remoteAurorianIds, notionAurorianIds);
    logger.info(
      `find new ${diffAurorianIds.length} aurorians`,
      diffAurorianIds,
    );
  }
}
