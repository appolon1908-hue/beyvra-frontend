import React from 'react'
//import tradxLogo from 'assets/home/tradxlogo.png';

const KYCHeader = ({step}: {step: number}) => {
  return (
    <div className='fixed top-0 z-10 w-full bg-[#000000] flex items-center justify-center text-center '>
      <div className='h-2 bg-[#208a4c] w-full absolute top-0 left-0'>
        <div className='h-full bg-[#35ea80]' style={{ width: `${(step / 8) * 100}%` }}></div>

      </div>
        
        <img src='/logo.svg' alt="" className='w-10 pt-4 pb-2' />
        
    </div>
  )
}

export default KYCHeader