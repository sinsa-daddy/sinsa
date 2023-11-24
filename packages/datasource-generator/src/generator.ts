/* eslint-disable max-depth */
import * as lark from '@larksuiteoapi/node-sdk';
import { ensureDir, writeJSON } from 'fs-extra';
import { join } from 'upath';
import {
  AurorianSchema,
  AurorianType,
  CopilotType,
  RemoteCopilotSchema,
  toCopilot,
  TableSummaryBaseSchema,
  TableSummarySchema,
  type TableSummaryType,
} from '@sinsa/schema';
import type {
  AurorianAppPartial,
  CopilotAppPartial,
  GenerateDataSourceOptions,
  OutputDirPartial,
} from './types';
import { parseTableSummaryTitle } from './utils/parse-table-summary-title';
import { PriorityQueue } from './lib/priority-queue';

export class DataSourceGenerator {
  private _client: lark.Client | undefined;

  constructor({ appSecret, appId }: GenerateDataSourceOptions) {
    this._client = new lark.Client({
      appId,
      appSecret,
    });
  }

  /**
   * 生成最近 k 期荒典数据
   */
  async generateCopilot({
    copilotAppToken,
    outputDir,
    k = 5,
  }: CopilotAppPartial & OutputDirPartial & { k?: number }): Promise<void> {
    if (!this._client) {
      return;
    }

    const priorityQueue = new PriorityQueue<TableSummaryType>(
      (a, b) => b.term - a.term,
    );

    for await (const responseItem of await this._client.bitable.appTable.listWithIterator(
      {
        path: {
          app_token: copilotAppToken,
        },
        params: {
          page_size: 100,
        },
      },
    )) {
      if (Array.isArray(responseItem?.items) && responseItem?.items.length) {
        for (const item of responseItem.items) {
          try {
            const tableSummaryBase = TableSummaryBaseSchema.parse(item);
            const term = parseTableSummaryTitle(tableSummaryBase.name);
            if (Number.isInteger(term)) {
              priorityQueue.enqueue(
                TableSummarySchema.parse({
                  ...tableSummaryBase,
                  term,
                }),
              );
            }
          } catch (error) {
            // ignore
          }
        }
      }
    }

    const allPromises: Promise<void>[] = [];

    const topKTableSummaries = priorityQueue.getTopK(k);

    console.log(`Write ${topKTableSummaries.length} copilot(s)`);
    await ensureDir(outputDir);
    const writeTermsPromise = writeJSON(
      join(outputDir, './terms.json'),
      topKTableSummaries,
    );
    allPromises.push(writeTermsPromise);

    const writeCopilotsPromises = topKTableSummaries.map(async tableSummary => {
      if (!this._client) {
        return;
      }

      const copilotsInThisTable: Record<string, CopilotType> = {};

      for await (const responseItem of await this._client.bitable.appTableRecord.listWithIterator(
        {
          path: {
            app_token: copilotAppToken,
            table_id: tableSummary.table_id,
          },
          params: {
            page_size: 100,
            sort: `["score DESC"]`,
          },
        },
      )) {
        if (Array.isArray(responseItem?.items) && responseItem?.items.length) {
          for (const item of responseItem.items) {
            try {
              const remoteCopilot = RemoteCopilotSchema.parse(item.fields);
              const copilot = toCopilot(remoteCopilot);
              copilotsInThisTable[copilot.bv] = copilot;
            } catch {
              console.log(`Failed to parse ${item}`);
            }
          }
        }
      }

      const writeDirPath = join(outputDir, './copilots');
      await ensureDir(writeDirPath);
      await writeJSON(
        join(writeDirPath, `./${tableSummary.table_id}.json`),
        copilotsInThisTable,
        {
          replacer(_, value) {
            return typeof value === 'bigint' ? value.toString() : value;
          },
        },
      );
    });
    allPromises.push(...writeCopilotsPromises);

    await Promise.all(allPromises);
  }

  /**
   * 生成光灵数据
   */
  async generateAurorian({
    aurorianAppToken,
    aurorianTableId,
    outputDir,
  }: AurorianAppPartial & OutputDirPartial): Promise<void> {
    if (!this._client) {
      return;
    }

    const auroriansMap: Record<string, AurorianType> = {};

    for await (const responseItem of await this._client.bitable.appTableRecord.listWithIterator(
      {
        path: {
          app_token: aurorianAppToken,
          table_id: aurorianTableId,
        },
        params: {
          page_size: 100,
        },
      },
    )) {
      if (Array.isArray(responseItem?.items) && responseItem?.items.length) {
        for (const item of responseItem.items) {
          // try {
          //   const aurorian = AurorianSchema.parse(item);
          //   auroriansMap[aurorian.aurorian_name] = aurorian;
          // } catch {
          //   console.log(`Failed to parse ${item}`);
          // }

          const aurorian = AurorianSchema.parse(item.fields);
          auroriansMap[aurorian.aurorian_name] = aurorian;
        }
      }
    }

    await ensureDir(outputDir);
    await writeJSON(join(outputDir, './aurorians.json'), auroriansMap, {
      replacer(_, value) {
        return typeof value === 'bigint' ? value.toString() : value;
      },
    });
  }
}
