export interface EconomicCalendarFilters {
  importance: string;
  country: string;
  date: any;
}

export interface DataItem {
  key: string;
  icon: string;
  iconSvg: any;
  country: string;
  recency: string;
  event: string;
  setAlert: string;
  relevance: string;
  subPips: string;
  subTitle: string;
  exportNews: string;
}

export interface ColumnItem {
  title: string;
  dataIndex: keyof DataItem;
  key: string;
}
