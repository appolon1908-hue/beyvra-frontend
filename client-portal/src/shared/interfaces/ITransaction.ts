export enum TransactionType {
  D = "D",
  W = "W",
}

export enum TransactionStatusType {
  S = "S",
  F = "F",
  P = "P",
}

export default interface ITransaction {
  id: number;
  bank_account: {
    id: number;
    created_at: string;
    updated_at: string;
    bank_name: string;
    account_number: string;
    account_holder_name: string;
    last_name: string;
    routing_number: string;
    swift_code: string;
    iban: string;
    country: string;
  };
  currency: {
    id: number;
    name: string;
    symbol: string;
    longer_name: string;
    image: null | string;
    is_crypto: boolean;
  };
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  created_at: string;
  updated_at: string;
  withdrawal_id: string;
  amount: string;
  status: string;
  request_date: string;
  approval_date: null | string;
  description: string;
  network_fee: string;
  txid: null | string;
  estimated_completion_time: null | string;
  reason: null | string;
  denial_date: null | string;
  sender_name: null | string;
  sender_account_number: null | string;
  sender_contact_info: null | string;
  wallet: null | string;
  approved_by: null | string;
}
