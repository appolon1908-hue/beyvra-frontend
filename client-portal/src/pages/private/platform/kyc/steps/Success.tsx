import React from 'react'
import successIcon from '../../../../../assets/icons/kyc/Illustration.svg'
import { useNavigate } from 'react-router-dom'
import KYCButton from '../components/Button'

interface successProps {
  handleNext: (dir: string) => void
}
const SuccessView: React.FC<successProps> = ({handleNext}) => {
  const navigate = useNavigate()
  const handleNav = () => {
    // navigate('/platform') 
    handleNext("next")

  }
  return (
    <div className='max-w-md w-full mx-auto formContainer px-5'>
        <div className='flex justify-center items-center m-auto block text-center w-max success-illustration mb-10'>
            <span className='img-container flex justify-center items-center'>
            <img src={successIcon} alt=""  className=''/>
            </span>
        </div>

        <h4 className='text-center text-3xl leading-9 text-white font-bold'>Success! <br/>
        Go to your dashboard
        </h4>
        <KYCButton
          text="Go to dashboard"
          onClick={handleNav}
          type="submit"
          className="kyc-button text-base font-semibold mt-8 py-4"
        />
    </div>
  )
}

export default SuccessView