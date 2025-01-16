import { PaymentMethodDataType } from "./types";

import {
  BlueCardIcon,
} from "../../../../../assets/icons";
import {
  BinanceIcon,
  PerfectMoneyIcon,
  TetherUSDTRIcon,
  TetherUSDTERCIcon,
  TetherUSDTBSCIcon,
  BitcoinIcon,
  ShibaInuIcon,
  DodgeCoinIcon,
  SolanaIcon,
  PolygonIcon,
  DaiIcon,
  BinanceCoinIcon,
  TronIcon,
  USDcoinIcon,
  XrpIcon,
  PayPalIcon,
  StripeIcon,
} from "../../../../../assets/payment-methods-icons";

export const paymentMethodData: PaymentMethodDataType = {
  bankCards: [
    {
      name: "Bank Cards",
      methodIcon: <BlueCardIcon />,
    },
  ],
  ePaymentSystems: [
    {
      name: "BinancePay",
      methodIcon: <BinanceIcon />,
    },
    {
      name: "Perfect Money",
      methodIcon: <PerfectMoneyIcon />,
    },
    {
      name: "PayPal",
      methodIcon: <PayPalIcon />,
    },
    {
      name: "Stripe",
      methodIcon: <StripeIcon />,
    },
  ],
  crypto: [
    {
      name: "USDT (TRC20)",
      methodIcon: <TetherUSDTRIcon />,
    },
    {
      name: "USDT (ERC20)",
      methodIcon: <TetherUSDTERCIcon />,
    },
    {
      name: "USDT (BSC BEP-20)",
      methodIcon: <TetherUSDTBSCIcon />,
    },
    {
      name: "Bitcoin",
      methodIcon: <BitcoinIcon />,
    },
    {
      name: "Shiba Inu",
      methodIcon: <ShibaInuIcon />,
    },
    {
      name: "Dodge Coin (BSC BEP-20)",
      methodIcon: <DodgeCoinIcon />,
    },
    {
      name: "Solana",
      methodIcon: <SolanaIcon />,
    },
    {
      name: "Polygon",
      methodIcon: <PolygonIcon />,
    },
    {
      name: "DAI (BSC BEP-20)",
      methodIcon: <DaiIcon />,
    },
    {
      name: "Binance Coin (BSC BEP-20)",
      methodIcon: <BinanceCoinIcon />,
    },
    {
      name: "TRX",
      methodIcon: <TronIcon />,
    },
    {
      name: "USD Coin (TRC20)",
      methodIcon: <USDcoinIcon />,
    },
    {
      name: "XRP",
      methodIcon: <XrpIcon />,
    },
  ],
};

export const filterListButtons = ["All", "bankCards", "ePaymentSystems", "crypto"];