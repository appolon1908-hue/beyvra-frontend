export default interface IWalletType {
  
  id: number;
  symbol: string;
  name: string;
  is_crpto:boolean;
  image?:boolean;
  is_active: boolean;
  is_fiat?: boolean;
  longer_name?:string;
  created_at: string;
  updated_at: string;
}
