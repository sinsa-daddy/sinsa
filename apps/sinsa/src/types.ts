declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    $subscribeTermsUpdate?: Promise<{
      cacheName: string;
      updatedURL: string;
      terms: unknown[];
    }>;
  }
}

export {};
