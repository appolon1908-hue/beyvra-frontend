import React, { useEffect, useState } from 'react'
import "./kyc.scss"
import HelpButton from '../../../../assets/icons/kyc/Button.svg'

import KYCHeader from './components/Header'
import CreateAccount from './steps/createAccount'
import SignInOptions from './steps/SignInOptions'
import SignInForm from './steps/EmailSignIn'
import PhoneSignInForm from './steps/NumberSignInForm'
import OTP from './steps/OTP'
import SuccessView from './steps/Success'
import DocumnetUpload from './steps/DocumentUpload'
import BioDetails from './steps/BioDetails'
import DocumentReviewApprove from './steps/DocumentReviewApproved'
import DocumentReviewRejected from './steps/DocumentReviewRejected'
import DocumentReviewPending from './steps/DocumentReviewPending'

const KYC = () => {
  const [step, setStep] = useState(1)
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get("query");
  const [forgotPasswordView, setForgotPasswordView] = useState(false);

  const [signInProcess, setSignInProcess] = useState<string>("email")



  console.log(queryParam)
  const handleNextPage = (dir: string) => {
    if(step == 8 ){
      return
    }else{
      if(dir == "next")
      {
      setStep(prev => prev + 1)
      }

      else{
        setStep(prev => prev -1)

      }

    }
  }


  const renderPage = () => {
    switch (step) {
      case 1:
      return <CreateAccount
          handleNext={handleNextPage }
      />
        
      case 2:
      return <SignInOptions
      handleNext={handleNextPage }
      setSignInProcess={setSignInProcess}
      />
          
      case 3:
       return  signInProcess=="email" ?  
       <SignInForm
       handleNext={handleNextPage }
       setForgotPasswordView={setForgotPasswordView}

       />  : <PhoneSignInForm
       handleNext={handleNextPage }
       setForgotPasswordView={setForgotPasswordView}

      />
            
      case 4:
        return  <OTP
        handleNext={handleNextPage}/>
      
      case 5:
        return <SuccessView
        handleNext={handleNextPage}
        />

        case 6: 
        return <BioDetails
        handleNext={handleNextPage}
        />
        case 7: 
        return <DocumnetUpload
        handleNext={handleNextPage}
        />

        case 8:
          return <DocumentReviewPending/>    
        case 9:
          return <DocumentReviewRejected/> 
        case 10:
          return <DocumentReviewApprove/>

      default:
      return null;
  }
}

useEffect(()=> {
  if(queryParam == "biodata-kyc"){
    setStep(6)
  }
  if(queryParam == "document-kyc-result"){
    setStep(8)
  }
}
,[])
  return(
    <div className="kycWrapper  relative">
      <KYCHeader  step={step}/>
      <div className='max-w-[620px] flex justify-center lg:items-center min-h-[100vh]  h-full pt-24 lg:pt-16  w-full mx-auto '>
        <div className="w-full">
          <span className=' p-0 absolute bottom-0 right-10'>
            <img src={HelpButton} alt="" className=''/>
          </span>
        {renderPage()}
        </div>
      </div>
    </div>
  )
}

export default KYC