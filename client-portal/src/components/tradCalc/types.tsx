export interface DataContentType {
  header: {
    title: string;
    text: string;
  };
  firstBlock: Array<{
    title: string;
    value?: string;
    isList?: boolean;
    isPrice?: boolean;
    isDate?: boolean;
  }>;
  secondBlock: Array<{
    title: string;
    img?: string;
  }>;
}

export type DataContentKeys =
  | "CFD Trading Calculator"
  | "Commodities Profit Calculator"
  | "Forex Profit Calculator"
  | "Forex Margin Calculator";
