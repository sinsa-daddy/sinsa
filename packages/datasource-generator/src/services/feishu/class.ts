import { Client } from '@larksuiteoapi/node-sdk';
import type { AurorianNextType, CopilotNextType } from '@sinsa/schema';
import { memoize } from 'lodash';
import {
  FeishuTableMetaSchema,
  type FeishuTableMetaType,
} from './schema/feishu-table-meta';
import { FeishuLegacyCopilotItemSchema } from './schema/feishu-legacy-copilot';
import { toCopilotFromLegacy } from './helpers/to-copilot-from-legacy';

export interface FeishuClientOptions {
  appId: string;
  appSecret: string;
  tableAppIds: {
    copilots: string;
  };
}

export class FeishuService {
  private static _isCopilotTable(tableMeta: FeishuTableMetaType) {
    return tableMeta.name.startsWith('荒典');
  }

  private static _isArchivedCopilotTable(tableMeta: FeishuTableMetaType) {
    return tableMeta.name.startsWith('[Archived]');
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
          page_size: 2,
          sort: `["upload_time DESC"]`,
          automatic_fields: true,
        },
      },
    )) {
      if (Array.isArray(row?.items)) {
        for (const record of row.items) {
          const feishuLegacyCopilotItem =
            FeishuLegacyCopilotItemSchema.parse(record);
          const copilot = toCopilotFromLegacy(
            feishuLegacyCopilotItem,
            getAurorianNextId,
          );
          console.log(
            'checked',
            copilot.copilot_id,
            copilot.term_id,
            copilot.aurorian_requirements.map(a => a.aurorian_id).join(','),
            copilot.author.name,
            copilot.score,
          );

          legacyCopilotsMap[copilot.copilot_id] = copilot;
        }
      }
    }

    return legacyCopilotsMap;
  }

  /**
   * 获取光灵作业数据表信息
   */
  async getCopilotsTableMeta() {
    /**
     * 可添加的数据表集合
     */
    const copilotsTablesMap: Record<
      FeishuTableMetaType['table_id'],
      FeishuTableMetaType
    > = {};

    /**
     * 已归档的数据表集合
     */
    const archivedCopilotsTablesMap: Record<
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
            copilotsTablesMap[parsedTableMeta.table_id] = parsedTableMeta;
          } else if (FeishuService._isArchivedCopilotTable(parsedTableMeta)) {
            archivedCopilotsTablesMap[parsedTableMeta.table_id] =
              parsedTableMeta;
          }
        }
      }
    }

    return {
      copilotsTablesMap,
      archivedCopilotsTablesMap,
    };
  }

  /**
   * 批量上传作业
   */
  async batchUploadCopilot({ uploadTableId }: { uploadTableId: string }) {
    await this._client.bitable.appTableRecord.batchCreate({
      data: {
        records: [
          {
            fields: new Map(),
          },
        ],
      },
    });
  }
}
