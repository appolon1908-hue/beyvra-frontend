import React, { useEffect, useState } from 'react'
import "../kyc.scss"
import FileInput from 'components/fileInput/fileInput'
import { useAppSelector } from '@store/hooks'
import { toast } from 'react-toastify'
import useKycFilesPostForm from 'api/kyc/useKycFilesPost'
import { useCookies } from 'react-cookie'
import useKyc from 'api/kyc/useKycInfo'
import KYCButton from '../components/Button'
interface documentProps {
  handleNext: (dir: string) => void
}

const DocumnetUpload: React.FC<documentProps>  = ({handleNext}) => {
  const [data, setData] = useState<{identity: {name: string}, address: {name: string}} | {} > ({})
  const [identityDoc, setIdentityDoc] = useState<FormData | null>(null)
  const [addressDoc, setAddressDoc] = useState<FormData | null>(null)
  const [cookies] = useCookies(["access_token"]);

  const {kyc} = useAppSelector(state => state.userBio)
  const [kycId, setKycId] = useState(kyc || "")


  const { mutate, isPending } = useKycFilesPostForm({
    onSuccess: () => {
      toast.success(
        "Your document have been uploaded successsfully."
      );
      handleNext("next")

    },
    onError: (error) => {
      console.error("fetching add file Kyc error", error);
    },
    });


    const { mutate: mutateKYCData } = useKyc({
      onSuccess: (data) => {
        console.log("pull key",data)
        setKycId(data.results[0].id)
     
        }
  
       },
      )
  

  const handleFileUpload = () => {
    if(!identityDoc){
      toast.error("Upload your identity Document. Cannot upload files.");

    }
    if (!kyc && !kycId ) {
      toast.error("KYC data is missing. Cannot upload files.");
      return;
    }
    if (identityDoc && addressDoc) {
      identityDoc.append("desc", "identity");
      identityDoc.append("kyc", kyc?.toString() ?? kycId.toString());
  
      addressDoc.append("desc", "proof_of_address");
      addressDoc.append("kyc", kyc?.toString() || kycId.toString());
  
      mutate({
        token: cookies.access_token,
        identityDoc,
        addressDoc
      });
  
      console.log(cookies.access_token);
    }
  };
  

  useEffect(()=> {
    mutateKYCData({token: cookies.access_token})

    
  }, [])
  return (
    <div className='bg-[#152338] formContainer px-5  kyc-document flex justify-center items-center'>
      <div className='m-auto w-full border border-gray-900 bg-black-100'>
        <h3 className='text-gray-100 font-semibold text-2xl leading-6 my-2'> Enter you KYC document </h3>
        <p className='text-[#A3A8B0] my-4'>You can upload passport, national ID, or driver's licence</p>


        <FileInput
        handleChange={(value: FormData) => setIdentityDoc(value)}        
        />

        <h3 className='text-2xl font-semibold text-white my-3'>Proof of Address</h3>
        <p className='text-[#A3A8B0] text-base font-normal my-3'>Please upload utility bill or bank statement. Date shouldn’t be later than last 3 months.</p>
        
        <FileInput
         handleChange={(value: FormData) => setAddressDoc(value)}
        />

        <div className="flex my-8 gap-5 lg:gap-x-10 justify-between">
          <div className="flex-grow">
            <KYCButton
              text="Back"
              isLoading={false}
              disable={isPending}
              type="button"
              className="kyc-button text-base font-semibold back"
              onClick={() => handleNext("back")}
            />
          </div>
          <div className="flex-grow">
            <KYCButton
              text="Next"
              isLoading={isPending}
              onClick={handleFileUpload} 
              disable={isPending}
              type="submit"
              className="kyc-button text-base font-semibold"
            />
          </div>
        </div>
    
        
        </div>

    </div>
  )
}

export default DocumnetUpload