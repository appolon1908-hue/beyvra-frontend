export default interface IUserKYCProps {
    full_name: string;
    country: string;
    address: string;
    year: string;
    month: string;
    day: string;
    id_number: string;
    id_type: string,
    dob: string;
    id?: number | null;
    image: File | null;
    selfie: string | null;
    first_name: string;
        last_name: string;
        email: string
    user: {
        first_name: string;
        last_name: string;
        email: string
    }
  }