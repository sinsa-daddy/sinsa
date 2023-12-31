import type { InputNotionTermType } from './schema/notion-term';

export interface NotionDataBaseServiceInitOptions {
  auth: string;
}

export interface GetTermsOptions {
  database_id: string;
}

export interface GetAuroriansOptions {
  database_id: string;
}

export interface AddCopilotOptions {
  database_id: string;
  properties: InputNotionTermType;
}
