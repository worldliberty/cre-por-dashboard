interface GtagParams {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent' | 'js' | 'set',
      targetOrAction: string | Date,
      params?: GtagParams,
    ) => void;
    dataLayer: Array<unknown>;
  }
}

export {};
