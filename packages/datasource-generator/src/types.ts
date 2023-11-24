export interface CopilotAppPartial {
  /**
   * 荒典多维表格 app_token
   */
  copilotAppToken: string;
}

export interface AurorianAppPartial {
  aurorianAppToken: string;
  aurorianTableId: string;
}

export interface OutputDirPartial {
  outputDir: string;
}

export interface GenerateDataSourceOptions {
  appId: string;
  appSecret: string;
}
