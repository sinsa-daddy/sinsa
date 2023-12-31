import { Client, isFullPage, iteratePaginatedAPI } from '@notionhq/client';
import type {
  AddCopilotOptions,
  NotionDataBaseServiceInitOptions,
  GetTermsOptions,
  GetAuroriansOptions,
} from './types';
import type { NotionTermType } from './schema/notion-term';
import { NotionTermSchema } from './schema/notion-term';
import type { NotionAurorianType } from './schema/notion-aurorian';
import { NotionAurorianSchema } from './schema/notion-aurorian';

export class NotionDataBaseService {
  private notion: Client;

  constructor({ auth }: NotionDataBaseServiceInitOptions) {
    this.notion = new Client({ auth });
  }

  getUsers() {
    return this.notion.users.list({});
  }

  async getTerms({ database_id }: GetTermsOptions) {
    console.log('Querying terms...');

    const queryDataResponse = await this.notion.databases.query({
      database_id,
      sorts: [{ property: 'term', direction: 'descending' }],
    });

    const notionTerms: NotionTermType[] = [];

    for (const page of queryDataResponse.results) {
      if (isFullPage(page)) {
        const notionTerm = NotionTermSchema.parse(page);
        notionTerms.push(notionTerm);
      }
    }

    console.log(`Got ${notionTerms.length} term(s).`);

    return notionTerms;
  }

  async getAurorians({ database_id }: GetAuroriansOptions) {
    console.log('Querying aurorians...');

    const notionAurorians: Record<
      NotionAurorianType['id'],
      NotionAurorianType
    > = {};

    for await (const page of iteratePaginatedAPI(this.notion.databases.query, {
      database_id,
    })) {
      if (isFullPage(page)) {
        const notionAurorian = NotionAurorianSchema.parse(page);

        notionAurorians[
          notionAurorian.properties.aurorian_name.title[0].text.content
        ] = notionAurorian;
      }
    }

    console.log(`Got ${Object.keys(notionAurorians).length} aurorian(s).`);

    return notionAurorians;
  }

  async addCopilot({ database_id, properties }: AddCopilotOptions) {
    const newPage = await this.notion.pages.create({
      parent: {
        database_id,
      },
      properties,
    });
    console.log(newPage);
  }
}
