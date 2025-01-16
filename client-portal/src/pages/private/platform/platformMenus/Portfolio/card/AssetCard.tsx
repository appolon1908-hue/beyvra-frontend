import React from 'react'
import './card.scss'
import { IndicatorGreen, IndicatorRed } from 'assets/icons';
interface assetCardProps {
    className?: string;
    value: number;
    investment: string;
    percentage: number
}
const AssetCard: React.FC<assetCardProps> = ({className, value, investment, percentage}) => {
  return (
    <div className='assetCard py-3 px-5 h- rounded-xl overflow-hidden'>
        <p className='text-lg leading'>{investment}</p>
        <h4 className='text-2xl font-semibold mt-2'>${value}</h4>
        <div className='flex items-center mt-2.5 md:flex-col lg:flex-row'>
            <span className='basis-[40%] flex gap-3 items-center'>
                {percentage < 0 ? <IndicatorRed/> : <IndicatorGreen/>}

                <span className={`${percentage < 0 ? 'loss' : 'gain'} text-xl`}>{percentage} %</span>
            
            </span>
            <span className='text-white/80 text-base basis-[60%]'>Description</span>
        </div>
        
    </div>
  )
}

export default AssetCard