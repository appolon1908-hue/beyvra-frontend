export default interface IUser {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  blured_email?: string;
  email_verified?: boolean;
  trader_id?: string;
  username?: string;
  profile_picture?: string;
  phone_number?: string;
  blured_phone_number?: string;
  phone_verified?: boolean;
  is_walkthrough?: boolean;
  two_factor_authentication_enabled?: boolean;
}
