export interface NotionClientOptions {
  notionToken: string;
  databaseIds: {
    aurorians: string;
  };
}

export interface SumbmitAuroriansOptions {
  downloadAvatar?: DownloadAvatarConfig;
}

export interface DownloadAvatarConfig {
  baseURL: string;
  directory: string;
}
