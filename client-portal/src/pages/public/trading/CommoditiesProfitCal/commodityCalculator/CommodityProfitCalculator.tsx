import React from 'react'
import './commodityProfitCalculator.scss'
import CommCalc from '../../../../../assets/trading/commodityCalImg.png'


interface TradingprofitPrps{
    title: string,
    text1: string,
    text2: string,
    image: string,
    icon1: string,
}
const CommodityCalculator: React.FC<TradingprofitPrps> = ({title, text1, text2, image, icon1}) => {
  return (
    <div className='commodityProfitWrapper'>
       
        <div className='textWrapper'>
            <h3>{title}</h3>
            <p>{text1}</p>
            <p>{text2}</p>
        </div>
        <div className='imageBackdrop'>
            <div>         
            <img src={image} alt="background image" /> 
            <img src={icon1} alt="" className='icon-1' />
            <img src={CommCalc} alt=""  className='comCal' />
            </div>
        </div>
    </div>
  )
}

export default CommodityCalculator