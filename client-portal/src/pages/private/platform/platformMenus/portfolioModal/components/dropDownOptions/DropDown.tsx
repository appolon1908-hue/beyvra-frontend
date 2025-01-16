import { DownArrowIcon } from 'assets/icons'
import React, { useState } from 'react'
import './dropdown.scss'

interface dropDownProps {
    options: string;
    children: React.ReactNode;
    }

const DropDownOptions: React.FC<dropDownProps> = ({options, children}) => {
    const [toggleDropDown, setToggleDropDown] = useState<boolean>(false)
  return (
    <div className='settings-dropdown'>
        <div className='bg-[#434343] py-3 min-h-2  flex items-center justify-between px-6 rounded-xl my-1'>
            <p>{options}</p>
            <span className='cursor-pointer hover:bg-gray-50/10 rounded-full  p-1' onClick={() =>  setToggleDropDown(prev => !prev)}>
            <DownArrowIcon/>
            </span>
        </div>
        <div className={`${toggleDropDown ? "let-down" : "let-up"}  dropdown-options px-3`}>
                {children}  
         </div>
    </div>
  )
}

export default DropDownOptions