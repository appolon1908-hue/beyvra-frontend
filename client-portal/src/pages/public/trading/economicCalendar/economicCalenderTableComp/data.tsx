import { ColumnItem, DataItem } from "./types";
import DEIcon from "./icons/de.svg"
import USIcon from "./icons/de.svg"
import AlertIcon from "./icons/alert.svg"
import DoneIcon from "./icons/done.svg"

export const columns: ColumnItem[] = [
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
  },
  {
    title: "Recency",
    dataIndex: "recency",
    key: "recency",
  },
  {
    title: "Event",
    dataIndex: "event",
    key: "event",
  },
  {
    title: "Set Alert",
    dataIndex: "setAlert",
    key: "alert",
  },
  {
    title: "Relevance",
    dataIndex: "relevance",
    key: "relevance",
  },
  {
    title: "Expand News",
    dataIndex: "exportNews",
    key: "expandNews",
  },
];

export const data: DataItem[] = [
  {
    key: "1",
    iconSvg: USIcon,
    icon: "US",
    country: "United States",
    recency: "15h",
    event: "Factory Orders MoM J",
    setAlert: AlertIcon,
    relevance: "HIGH",
    subPips: "*124.88 pips",
    subTitle: "volatility during the last 4 hours after prior events",
    exportNews: DoneIcon,
  },
  {
    key: "2",
    iconSvg: USIcon,
    icon: "US",
    country: "United States",
    recency: "15h",
    event: "Factory Orders MoM J",
    setAlert: AlertIcon,
    relevance: "HIGH",
    subPips: "*124.88 pips",
    subTitle: "volatility during the last 4 hours after prior events",
    exportNews: DoneIcon,
  },
  {
    key: "3",
    iconSvg: DEIcon,
    icon: "DE",
    country: "Germany",
    recency: "15h",
    event: "Factory Orders MoM J",
    setAlert: AlertIcon,
    relevance: "HIGH",
    subPips: "*124.88 pips",
    subTitle: "volatility during the last 4 hours after prior events",
    exportNews: DoneIcon,
  },
  {
    key: "4",
    iconSvg: DEIcon,
    icon: "DE",
    country: "Germany",
    recency: "15h",
    event: "Factory Orders MoM J",
    setAlert: AlertIcon,
    relevance: "HIGH",
    subPips: "*124.88 pips",
    subTitle: "volatility during the last 4 hours after prior events",
    exportNews: DoneIcon,
  },
];
