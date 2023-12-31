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
  TableSummarySchema,
  type TableSummaryType,
  TermType,
  TermSchema,
} from '@sinsa/schema';
import { mergeWith } from 'lodash';
import type {
  AurorianAppPartial,
  CopilotAppPartial,
  GenerateDataSourceOptions,
  OutputDirPartial,
} from './types';

export class DataSourceGenerator {
  private _client: lark.Client | undefined;

  constructor({ appSecret, appId }: GenerateDataSourceOptions) {
    this._client = new lark.Client({
      appId,
      appSecret,
    });
  }

  /**
   * 生成荒典数据
   */
  async generateCopilot({
    copilotAppToken,
    outputDir,
  }: CopilotAppPartial & OutputDirPartial): Promise<void> {
    if (!this._client) {
      return;
    }

    const tableSummaries: TableSummaryType[] = [];

    let BOSSTableId: string | null = null;
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
            const tableSummary = TableSummarySchema.parse(item);
            if (tableSummary.name.startsWith('荒典')) {
              tableSummaries.push(tableSummary);
            } else if (tableSummary.name.startsWith('BOSS')) {
              BOSSTableId = tableSummary.table_id;
            }
          } catch (error) {
            // ignore
          }
        }
      }
    }

    const writeCopilotsPromises = tableSummaries.map(async tableSummary => {
      if (!this._client) {
        return;
      }

      const copilotsInThisTable: CopilotType[] = [];

      for await (const responseItem of await this._client.bitable.appTableRecord.listWithIterator(
        {
          path: {
            app_token: copilotAppToken,
            table_id: tableSummary.table_id,
          },
          params: {
            page_size: 100,
            sort: `["upload_time DESC"]`,
          },
        },
      )) {
        if (Array.isArray(responseItem?.items) && responseItem?.items.length) {
          for (const item of responseItem.items) {
            try {
              const remoteCopilot = RemoteCopilotSchema.parse(item.fields);

              const copilot = toCopilot(remoteCopilot);

              copilotsInThisTable.push(copilot);
            } catch {
              console.log(`Failed to parse ${item}`, item);
            }
          }
        }
      }

      const mainCopilotsGroupedByTerm: Record<`${number}`, CopilotType[]> = {};
      const rerunCopilotsGroupedByTerm: Record<`${number}`, CopilotType[]> = {};

      for (const copilot of copilotsInThisTable) {
        if (Array.isArray(mainCopilotsGroupedByTerm[`${copilot.term}`])) {
          mainCopilotsGroupedByTerm[`${copilot.term}`].push(copilot);
        } else {
          mainCopilotsGroupedByTerm[`${copilot.term}`] = [copilot];
        }
        if (Array.isArray(copilot.rerun_terms)) {
          for (const rerunTerm of copilot.rerun_terms) {
            if (Array.isArray(rerunCopilotsGroupedByTerm[`${rerunTerm}`])) {
              rerunCopilotsGroupedByTerm[`${rerunTerm}`].push(copilot);
            } else {
              rerunCopilotsGroupedByTerm[`${rerunTerm}`] = [copilot];
            }
          }
        }
      }

      const copilotGroupedByTerm: Record<`${number}`, CopilotType[]> =
        mergeWith(
          mainCopilotsGroupedByTerm,
          rerunCopilotsGroupedByTerm,
          (obj, src) => {
            if (Array.isArray(obj)) {
              return obj.concat(src);
            }
            return undefined;
          },
        );

      for (const [term, copilotArray] of Object.entries(copilotGroupedByTerm)) {
        const copilotsInThisTerm: Record<CopilotType['bv'], CopilotType> = {};
        for (const c of copilotArray) {
          copilotsInThisTerm[c.bv] = c;
        }

        const writeDirPath = join(outputDir, './copilots');
        await ensureDir(writeDirPath);
        await writeJSON(
          join(writeDirPath, `./${term}.json`),
          copilotsInThisTerm,
          {
            replacer(_, value) {
              return typeof value === 'bigint' ? value.toString() : value;
            },
          },
        );
      }
    });
    await Promise.all(writeCopilotsPromises);

    if (BOSSTableId) {
      const termsInBossTable: TermType[] = [];

      for await (const responseItem of await this._client.bitable.appTableRecord.listWithIterator(
        {
          path: {
            app_token: copilotAppToken,
            table_id: BOSSTableId,
          },
          params: {
            page_size: 100,
            sort: `["term DESC"]`,
          },
        },
      )) {
        if (Array.isArray(responseItem?.items) && responseItem?.items.length) {
          for (const item of responseItem.items) {
            try {
              const term = TermSchema.parse({
                ...item.fields,
                _record_id: item.record_id,
              });

              if (Date.now() > term.start_time.valueOf()) {
                termsInBossTable.push(term);
              }
            } catch (error) {
              console.log(`Failed to parse ${item}`, error);
            }
          }
        }
      }

      console.log(`Write ${termsInBossTable.length} term(s)`);
      const termData = Array.from(termsInBossTable).sort(
        (a, b) => b.term - a.term,
      );
      await ensureDir(outputDir);
      const writeTermsPromise = writeJSON(
        join(outputDir, './terms.json'),
        termData,
      );

      await Promise.all([writeTermsPromise]);
    }
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
          sort: `["rarity DESC", "class ASC"]`,
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

          const aurorian = AurorianSchema.parse({
            ...item.fields,
            _record_id: item.record_id,
          });
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
