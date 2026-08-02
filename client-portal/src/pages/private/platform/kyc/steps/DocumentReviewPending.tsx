import React, { useEffect, useState } from 'react'
import FileCard from '../components/docCard/FileCard'
import KYCButton from '../components/Button'
import { useNavigate } from 'react-router-dom'
import useKycFiles, { KYCFileResponse } from 'api/kyc/useKycFiles'
import { useCookies } from 'react-cookie'
import { IKYCFilesProps } from '@interfaces'
import { getLatestDoc } from '../components/fileSelection/processFile'

const DocumentReviewPending = () => {

    
    const [cookies] = useCookies(["access_token"])
    const navigate = useNavigate()
    const [kycFiles, setKycFiles] = useState<IKYCFilesProps[]>()

    const {mutate, isPending} = useKycFiles({
        onSuccess: (data) => {

            console.log(data, "retrieved files")
            setKycFiles(data.results)

        },
        onError: () => {

        }
    })

    useEffect(()=> {
        mutate({
            token: cookies.access_token
        })
    },[cookies.access_token, mutate])

    const idFile = getLatestDoc(kycFiles || [], "identity")
    const proofOfAddress = getLatestDoc(kycFiles || [], "proof_of_address")
   
    
  return (
    <div className='max-w-4xl px-5 formContainer doc-review'>
        <h5 className='text-2xl text-white '>Thanks for uploading your documents.</h5>
        <p className='text-[#A3A8B0] my-4 text-base '>We will review them and inform you when any change happens. You can view
        your application status here or on your dashboard.</p>

        <div className=' my-5'>

            <div className='flex gap-4 justify-between items-start mb-4'>
                <FileCard
                fileName={idFile.fileName || ""} 
                fileSize={300}
                status={"pending"}
                />
                <span className='pending text-sm'>Pending</span>
            </div>
        <div>
            <span className='text-[#2dd674]'>Change file</span>
        </div>
        </div>

        <h5 className='text-2xl text-white '>Proof of Address</h5>
        <p className='text-[#A3A8B0] my-4 text-base '>Please upload utility bill or bank statement. Date shouldn’t be later than last 3 months..</p>


        <div className=' my-10'>
            <div className='flex gap-4 justify-between items-start mb-4'>
                <FileCard
                fileName={proofOfAddress.fileName || ""}
                fileSize={300}
                status={"pending"}
                />
                <span className='pending text-sm'>Pending</span>
            </div>
        <div>
            <span className='text-[#2dd674]'>Change file</span>
        </div>
        </div>

        <div  className='md:max-w-[160px] ml-auto'>
            <button onClick={()=> navigate("/platform")}>
                Go to dashboard
            </button>
        </div>

        {/* <div className='flex justify-between items-start my-5'>
            <FileCard
            fileName="Drivers Licence"
            fileSize={300}
            status={"rejected"}

            />

            <span className='rejected'>Rejected</span>
        </div> */}
        
        
    </div>
  )
}

export default DocumentReviewPending