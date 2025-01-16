import { CheckIcon, CheckIcon2 } from 'assets/icons'
import React from 'react'
import "./benefitCard.scss"
const BenefitList = ({title, text} : {title: string , text: string}) => {
  return (
    <div className='benefitList'>
 
                <div>

                    <CheckIcon2/>
                  </div>

                    <h3>{title}</h3>
                    <p>{text}</p>
 
    </div>
  )
}

export default BenefitList