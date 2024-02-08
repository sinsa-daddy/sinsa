/* eslint-disable max-depth */
import { Client, withUserAccessToken } from '@larksuiteoapi/node-sdk';
import type { AurorianNextType, CopilotNextType } from '@sinsa/schema';
import { chunk, memoize } from 'lodash';
import {
  FeishuTableMetaSchema,
  type FeishuTableMetaType,
} from './schema/feishu-table-meta';
import { FeishuLegacyCopilotItemSchema } from './schema/feishu-legacy-copilot';
import { toCopilotFromLegacy } from './helpers/to-copilot-from-legacy';
import { toFeishuCopilot } from './helpers/to-feishu-copilot';
import { toCopilotFromFeishu } from './helpers/to-copilot-from-feishu';
import { FeishuCopilotSchema } from './schema/feishu-copilot';

function log(...args: any) {
  return console.log('[feishu]', ...args);
}

export interface FeishuClientOptions {
  appId: string;
  appSecret: string;
  tableAppIds: {
    copilots: string;
  };
}

export class FeishuService {
  private static _isCopilotTable(tableMeta: FeishuTableMetaType) {
    return tableMeta.name.startsWith('HEAD_');
  }

  private static _isArchivedCopilotTable(tableMeta: FeishuTableMetaType) {
    return tableMeta.name.startsWith('ARCHIVED_');
  }

  private readonly _client: Client;

  private readonly _tableAppIds: FeishuClientOptions['tableAppIds'];

  constructor({ appId, appSecret, tableAppIds }: FeishuClientOptions) {
    this._client = new Client({
      appId,
      appSecret,
    });
    this._tableAppIds = tableAppIds;
  }

  /**
   * 获取遗留的历史作业
   */
  async getLegacyCopilotsMap({
    legacyCopilotTableId,
    legacyCopilotAppId,
    auroriansMap,
  }: {
    legacyCopilotTableId: string;
    legacyCopilotAppId: string;
    auroriansMap: Record<AurorianNextType['aurorian_id'], AurorianNextType>;
  }) {
    const legacyCopilotsMap: Record<
      CopilotNextType['copilot_id'],
      CopilotNextType
    > = {};

    const auroriansValues = Object.values(auroriansMap);
    const getAurorianNextId = memoize((enName: string) => {
      const found = auroriansValues.find(target => target.name === enName);
      if (found) {
        return found.aurorian_id;
      }
      throw new Error(`Cannot find ${enName}`);
    });

    for await (const row of await this._client.bitable.appTableRecord.listWithIterator(
      {
        path: {
          app_token: legacyCopilotAppId,
          table_id: legacyCopilotTableId,
        },
        params: {
          page_size: 500,
          sort: `["upload_time DESC"]`,
          automatic_fields: true,
        },
      },
    )) {
      if (Array.isArray(row?.items)) {
        const chunks: CopilotNextType[] = [];
        for (const record of row.items) {
          const feishuLegacyCopilotItem =
            FeishuLegacyCopilotItemSchema.parse(record);
          const copilot = toCopilotFromLegacy(
            feishuLegacyCopilotItem,
            getAurorianNextId,
          );

          legacyCopilotsMap[copilot.copilot_id] = copilot;
          chunks.push(copilot);
        }

        log(
          `已经读取到遗留的历史作业 ${JSON.stringify(
            chunks.map(c => `${c.author_name} ${c.copilot_id} ${c.score}`),
            null,
            2,
          )}`,
        );
      }
    }

    return legacyCopilotsMap;
  }

  /**
   * 获取光灵作业数据表信息
   */
  async getCopilotsTableMeta() {
    /**
     * 当前可添加的数据表
     */
    let currentCopilotTable: FeishuTableMetaType | null = null;

    /**
     * 已归档的数据表集合
     */
    const archivedCopilotsTablesMap: Record<
      FeishuTableMetaType['table_id'],
      FeishuTableMetaType
    > = {};

    /**
     * 剩余未知的数据表集合
     */
    const unknownTablesMap: Record<
      FeishuTableMetaType['table_id'],
      FeishuTableMetaType
    > = {};

    for await (const part of await this._client.bitable.appTable.listWithIterator(
      {
        path: {
          app_token: this._tableAppIds.copilots,
        },
        params: {
          page_size: 100,
        },
      },
    )) {
      if (Array.isArray(part?.items)) {
        for (const rawTableMeta of part.items) {
          const parsedTableMeta = FeishuTableMetaSchema.parse(rawTableMeta);
          if (FeishuService._isCopilotTable(parsedTableMeta)) {
            if (currentCopilotTable) {
              throw new Error(
                `find another HEAD table (${parsedTableMeta.name}), already have HEAD table (${currentCopilotTable.name})`,
              );
            } else {
              currentCopilotTable = parsedTableMeta;
            }
          } else if (FeishuService._isArchivedCopilotTable(parsedTableMeta)) {
            archivedCopilotsTablesMap[parsedTableMeta.table_id] =
              parsedTableMeta;
          } else {
            unknownTablesMap[parsedTableMeta.table_id] = parsedTableMeta;
          }
        }
      }
    }

    return {
      currentCopilotTable,
      archivedCopilotsTablesMap,
      unknownTablesMap,
    };
  }

  /**
   * 批量上传作业
   */
  async batchUploadCopilot({
    uploadTableId,
    dataSource,
    creatorUserAccessToken,
    chunkSize = 50,
  }: {
    uploadTableId: string;
    creatorUserAccessToken: string;
    dataSource: CopilotNextType[];
    chunkSize?: number;
  }) {
    const chunks = chunk(dataSource, chunkSize);
    for (const oneChunk of chunks) {
      await this._client.bitable.appTableRecord.batchCreate(
        {
          data: {
            records: oneChunk.map(record => {
              return {
                fields: toFeishuCopilot(record),
              };
            }),
          },
          path: {
            app_token: this._tableAppIds.copilots,
            table_id: uploadTableId,
          },
        },
        withUserAccessToken(creatorUserAccessToken),
      );

      log(
        `添加了作业`,
        JSON.stringify(
          oneChunk.map(c => `${c.author_name} ${c.copilot_id} ${c.score}`),
          null,
          2,
        ),
      );
    }
  }

  /**
   * 获取指定 table 的作业
   */
  async getCopilotsMapByTableId(tableId: string) {
    const copilotsMap: Record<CopilotNextType['copilot_id'], CopilotNextType> =
      {};

    for await (const row of await this._client.bitable.appTableRecord.listWithIterator(
      {
        path: {
          app_token: this._tableAppIds.copilots,
          table_id: tableId,
        },
        params: {
          page_size: 500,
          sort: `["upload_time DESC"]`,
          automatic_fields: true,
        },
      },
    )) {
      if (Array.isArray(row?.items)) {
        const chunks: CopilotNextType[] = [];
        for (const record of row.items) {
          const feishuLegacyCopilotItem = FeishuCopilotSchema.parse(record);
          const copilot = toCopilotFromFeishu(feishuLegacyCopilotItem);

          copilotsMap[copilot.copilot_id] = copilot;
          chunks.push(copilot);
        }

        log(
          `已经读取到作业 ${JSON.stringify(
            chunks.map(c => `${c.author_name} ${c.copilot_id} ${c.score}`),
            null,
            2,
          )}`,
        );
      }
    }
  }
}
