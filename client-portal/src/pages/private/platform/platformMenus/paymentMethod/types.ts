export type PaymentMethodDataType = {
  bankCards: {
    name: string;
    methodIcon: JSX.Element;
  }[];
  ePaymentSystems: {
    name: string;
    methodIcon: JSX.Element;
  }[];
  crypto: {
    name: string;
    methodIcon: JSX.Element;
  }[];
};
