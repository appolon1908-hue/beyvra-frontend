export type PaymentMethodDataType = {
  bankCards: {
    name: string;
    methodIcon: React.ReactElement;
  }[];
  ePaymentSystems: {
    name: string;
    methodIcon: React.ReactElement;
  }[];
  crypto: {
    name: string;
    methodIcon: React.ReactElement;
  }[];
};
