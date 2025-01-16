import React from 'react'
import './profitMarginGuide.scss'


interface ProfitMarginPrps{
    title: string,
    text1: string,
    text2: string,
    image: string,
    icon1: string,
    icon2: string
}
const ProfitMarginGuide: React.FC<ProfitMarginPrps> = ({title, text1, text2, image, icon1, icon2}) => {
  return (
    <div className='profitGuideWrapper'>
       
       
        <div className='imageBackdrop'>
            <div>         
            <img src={image} alt="background image" /> 
            <img src={icon1} alt="" className='icon-1' />
            <img src={icon2} alt="" className='icon-2' />

            </div>
        </div>
        <div className='textWrapper'>
            <h3>{title}</h3>
            <p>{text1}</p>
            <p>{text2}</p>
        </div>
    </div>
  )
}

export default ProfitMarginGuide