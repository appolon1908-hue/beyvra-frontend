import { IKYCFilesProps } from "@interfaces"

export const getLatestDoc = (kycFiles: IKYCFilesProps[], filter: string ) => {


    const matchfile = kycFiles.find((file :any) => file.desc == filter)

    const name = matchfile?.file.split("/").pop()
        return{
            fileName: name,
            size: "300KB"
        }


}