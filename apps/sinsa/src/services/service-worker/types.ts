declare global {
  interface Window {
    __TERMS_UPDATE_PROMISE__?: Promise<{
      cacheName: string;
      updatedURL: string;
      terms: unknown[];
    }>;
  }
}

export {};
