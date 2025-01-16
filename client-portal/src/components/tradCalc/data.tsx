import EuroSvg from "../../assets/markets/euro.svg";
import { DataContentKeys, DataContentType } from "./types";

export const dataContent: Record<DataContentKeys, DataContentType> = {
  "CFD Trading Calculator": {
    header: {
      title: "Choose your points of movement",
      text: "Сalculate your hypothetical P/L (aggregated cost and charges) if you had opened a trade today.",
    },
    firstBlock: [
      {
        title: "Market",
        value: "Commodity",
        isList: true,
      },
      {
        title: "Asset",
        value: "Gold",
        isList: true,
      },
    ],
    secondBlock: [
      {
        title: "Value",
        img: EuroSvg,
      },
      {
        title: "Commission",
        img: EuroSvg,
      },
      {
        title: "Spread",
      },
      {
        title: "Leverage",
      },
      {
        title: "Conversion Fee",
        img: EuroSvg,
      },
      {
        title: "Required Margin",
        img: EuroSvg,
      },
      {
        title: "Overnight Swaps",
        img: EuroSvg,
      },
    ],
  },
  "Commodities Profit Calculator": {
    header: {
      title: "Calculate your Commodities profit",
      text: "Calculate your hypothetical required margin for a Commodities position, if you had opened it now.",
    },
    firstBlock: [
      {
        title: "Category",
        value: "Commodity",
        isList: true,
      },
      {
        title: "Asset",
        value: "Gold",
        isList: true,
      },
      {
        title: "Entry price",
        isPrice: true,
      },
      {
        title: "Exit price",
        isPrice: true,
      },
    ],
    secondBlock: [
      {
        title: "Conversion Fee",
        img: EuroSvg,
      },
      {
        title: "Commission",
        img: EuroSvg,
      },
      {
        title: "Overnight Swaps",
        img: EuroSvg,
      },
      {
        title: "P/L",
      },
    ],
  },
  "Forex Profit Calculator": {
    header: {
      title: "Calculate your Forex profit",
      text: "Calculate your hypothetical profit for a Forex position, if you had opened it now.",
    },
    firstBlock: [
      {
        title: "Category",
        value: "Majors",
        isList: true,
      },
      {
        title: "Asset",
        value: "GBP/USD",
        isList: true,
      },
      {
        title: "Entry price",
        isPrice: true,
      },
      {
        title: "Exit price",
        isPrice: true,
      },
      {
        title: "Open Date",
        isDate: true,
      },
      {
        title: "Close Date",
        isDate: true,
      },
    ],
    secondBlock: [
      {
        title: "Conversion Fee",
        img: EuroSvg,
      },
      {
        title: "Commission",
        img: EuroSvg,
      },
      {
        title: "Overnight Swaps",
        img: EuroSvg,
      },
      {
        title: "Spread",
        img: EuroSvg,
      },
      {
        title: "P/L",
      },
      {
        title: "Conversion Price",
        img: EuroSvg,
      },
    ],
  },
  "Forex Margin Calculator": {
    header: {
      title: "Calculate your Forex margin",
      text: "Calculate your hypothetical required margin for a Forex position, if you had opened it now.",
    },
    firstBlock: [
      {
        title: "Category",
        value: "Majors",
        isList: true,
      },
      {
        title: "Asset",
        value: "GBP/USD",
        isList: true,
      },
      {
        title: "Bid",
        isPrice: true,
      },
      {
        title: "Ask",
        isPrice: true,
      },
    ],
    secondBlock: [
      {
        title: "Leverage",
        img: EuroSvg,
      },
      {
        title: "Conversion Price",
        img: EuroSvg,
      },
      {
        title: "Required Margin",
        img: EuroSvg,
      },
    ],
  },
};
