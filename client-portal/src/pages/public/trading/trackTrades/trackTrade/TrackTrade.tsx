import React from 'react'
import "./trackTrade.scss"
import { CheckIcon1, GoogleIcon } from 'assets/icons'

import piCard1  from '../../../../../assets/trading/Frame1.png'
import piCard2  from '../../../../../assets/trading/Frame2.png'
import piCard3  from '../../../../../assets/trading/Frame3.png'
import TGlobe  from '../../../../../assets/trading/T-globe.png'
import graphycon from '../../../../../assets/trading/graphycon.png'
const TrackTradeLanding = () => {
  return (
    <div className='trackTradeWrapper'>
        <div className='textWrapper'> 
            <h3>Follow Trades from  Top Traders</h3>

            <div className='subText'>
                <img src={graphycon} alt="graph icon" />
                <p>Trade alongside the signal providers with proven track records!</p>
            </div>
            <button>Copy Trading</button>


        </div>
        <div className='graphBackdrop'>
            <div>

                <img src={piCard1} alt="" className='card-2'/>
                <img src={piCard2} alt=""  className='card-1' />
                <img src={piCard3} alt=""  className='card-3' />
                <img src={TGlobe} alt=""  className='t-globe' />
                <div className='googleWrapper'>
                    <GoogleIcon/>

                </div>

            <div className='text-box'>           
                <span>  <CheckIcon1/> </span>
                <p>Successful Copy Trade!</p>

            </div>

        </div>

   



  

        </div>
    </div>
  )
}

export default TrackTradeLanding