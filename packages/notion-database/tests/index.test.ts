import { NotionDataBaseService } from '../src/notion-database-service';

describe('service', () => {
  test('it should work', async () => {
    const service = new NotionDataBaseService({
      auth: process.env.NOTION_ACCESS_TOKEN!,
    });

    await service.getAurorians({
      database_id: process.env.NOTION_AURORIAN_DATABASE_ID!,
    });

    // await service.addCopilot({
    //   database_id: process.env.NOTION_TERM_DATABASE_ID!,
    //   properties: {
    //     term: { type: 'number', number: 188 },
    //     boss_name: {
    //       type: 'title',
    //       title: [{ type: 'text', text: { content: '无聊' } }],
    //     },
    //     boss_attribute: {
    //       type: 'select',
    //       select: {
    //         name: AurorianAttributeType.Thunder,
    //       },
    //     },
    //     period: {
    //       type: 'date',
    //       date: {
    //         start: new Date().toISOString(),
    //         end: new Date().toISOString(),
    //       },
    //     },
    //     features: {
    //       type: 'rich_text',
    //       rich_text: [
    //         {
    //           type: 'text',
    //           text: {
    //             content: 'wtza',
    //           },
    //         },
    //       ],
    //     },
    //   },
    // });
  });
});
