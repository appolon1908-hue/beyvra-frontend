import React from 'react'
import "./metaTrading.scss"

import MT4 from "../../../../../assets/trading/MacBook Pro 16-inch Space Black Left.png"
import MT5 from '../../../../../assets/trading/MacBook Pro 16-inch Space Black-5.png'



const MetaTradingComponent = ({title, body, type} : {title: string, body: string, type: "mt4" | "mt5"}) => {
  return (
    <div className='metaTradingWrapper'>
      <div>

  
        <div className='graphicWrapper'>
            {type == "mt4" ?
            <img src={MT4} alt="" className='' />
            :
            <img src={MT5} alt="" className='' />
}
        </div>
        <div className='textWrapper'>
            <h3>{title}</h3>
            <p>{body}</p>

        </div>
        </div>
    </div>
  )
}

export default MetaTradingComponent