import React from 'react'
import './perksCard.scss'

interface TradingCardInfoProps {
    cardTitle?: string,
    cardText: string,
    icon: string
    type: "trade" | "follower"
}


const PerksCard: React.FC<TradingCardInfoProps>  = ({cardTitle, cardText, icon, type}) => {
  return (
    <div className={`perkCard ${type}`}>
        <div  className='perkCardIcon'>
            <img src={icon} alt='card icon' />
        </div>
        <h3>{cardTitle}</h3>

        <p>{cardText}</p>

        
    </div>
  )
}

export default PerksCard