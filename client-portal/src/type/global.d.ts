// global.d.ts
interface Window {
    __lc?: {
      license?: number;
      integration_name?: string;
      product_name?: string;
      asyncInit?: boolean;
      [key: string]: any; // Allows additional properties on __lc
    };
    LiveChatWidget?: any;
  }
  