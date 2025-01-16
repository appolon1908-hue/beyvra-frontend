import React, { useEffect } from 'react'
import nonVerifiedCard from '../../../../../../../assets/portfolio/verify-status.png'
import VerifiedCard from '../../../../../../../assets/portfolio/Vector.png'
import { useAppSelector } from '@store/hooks'
import IKYC from '@interfaces/IKYC'
import PrimaryButton from 'components/primaryButton/PrimaryButton'
import { useNavigate } from 'react-router-dom'
import './verificationstatus.scss'


interface profileModalProps {
  userKyc: string
}

const VerificationStatus: React.FC<profileModalProps> = ({ userKyc }) => {
  console.log(userKyc)
  // const []
  const { user } = useAppSelector(state => state.user)
  const navigate = useNavigate()



  return (
    <div className=" mt-4">
      {userKyc === 'F' && <div className="kycVerifyButton w-1/3 m-auto bg-red-20 mb-5">
        <PrimaryButton
          onClick={() => {
            navigate("/kyc-document/?query=biodata-kyc");
          }}
          className="verificationLearnMore"
          Title="Get Verifed"
        />
      </div>}

      <div>
        {/* <h3 className="text-base">KYC Verification Status</h3>
      <h4 className="text-gray-400 font-semibold text-sm">User</h4>
      <p className="text-sm">{user?.first_name + " " + user?.last_name}</p> */}

      </div>
      {/* <div className="mt-4">
      <p className="text-gray-500">Account number</p>
      <p className="font-normal">{user?.trader_id}</p>
    </div> */}

      <div className='text-center'>
        <p className="white">Current KYC Status</p>

        {userKyc === 'S' ? (<p className="text-green-500 text-sm">Verified</p>) : userKyc === 'P' ? (<p className="text-red-500 text-sm">Pending</p>) : (<p className="text-red-500 text-sm">Unverified</p>)}


        {/* <div className="pt-3 flex gap-3">
      <img src={VerifiedCard} alt="" className="bg-[#0094FF] p-3 rounded-xl h-16 w-14" />

      <img src={nonVerifiedCard} alt="" className="bg-gray-8 p-3 rounded-xl h-16 w-14 bg-white/40" />
      </div> */}


      </div>

    </div>
  )
}

export default VerificationStatus