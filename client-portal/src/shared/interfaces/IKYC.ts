import { IUserKYCProps } from "@interfaces";

export default interface IKYC {

        id: number,
        selfie: string
        user: IUserKYCProps,
        verified: boolean,
        status: string,
        id_type: string,
        dob: string,
  }
