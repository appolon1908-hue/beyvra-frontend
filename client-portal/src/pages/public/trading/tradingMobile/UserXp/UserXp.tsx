import React from 'react'
import tradeView from '../../../../../assets/trading/Xperience-img.png'
import emeralEth from '../../../../../assets/trading/ethereumEmerald.svg'
import inconBin from '../../../../../assets/trading/icon-binan.svg'
import tCoin from '../../../../../assets/trading/t-coin.svg'
import ukLogo from '../../../../../assets/trading/uk-circle.png'
import swidishLogo from '../../../../../assets/trading/swidish.png'
import TetherBgIcon from '../../../../../assets/trading/tether_trc20-mini.449f37398945f3d6bce614b9fd3a90b2.png'
import currencyCard from "../../../../../assets/trading/currencyInfoImage.png"
import './userXp.scss'
import { useTranslation } from 'react-i18next'
const UserExp = () => {
  const {t} = useTranslation()
  return (
    <div className="experienceWrapper">
      
    <div className='experienceUser'>
      <div className='exp-note'>
            <h3>{t("userXpEng")}</h3>
            <p>{t("userXpEntText")}</p>
            
        </div>
        <div className='imagery'>
            <img src={tradeView} alt="candle stick" className='mainBg' />
            <img src={inconBin} alt="candle stick" className='icon-coin'/>
            <img src={tCoin} alt="candle stick" className='t-coin'/>
            <img src={emeralEth} alt="candle stick" className='emeralL'/>
        </div>
       
        </div>

        <div className='experienceResponse'>
      
            <div className='exp-notice'>
              <div>
                <img src={ukLogo} alt="candle stick" className='flag-uk' />
                <p>{t("cardNote1")}</p>
              </div>

              <div>
                <img src={swidishLogo} alt="candle stick" className='lag-swis' />
                <p>{t("cardNote2")}</p>
              </div>
                
            </div>
            <div className='exp-note'>
                <h3>{t("resNewsHeader")}</h3>
                <p>{t("resNewsText")}</p>
                
            </div>
       
        </div>

        <div className="exp-info">
          <div className='exp-info-detail'>

              <h3>{t("userXpInfo")}</h3>
              <p>{t("userXpInfoText")}</p>
          </div>
          <div className='currencyDisp'> 
            <div className='tether-card'>
              <div className=''>
                <img src={TetherBgIcon} alt="" />
                <p>250 EUR</p>
              </div>
              <p>{t("estTime")}: 2 hours</p>



            </div>

            <div className='currencyInfo'>
                <img src={currencyCard} alt="dummy card info" />
            </div>
          </div>

            
        </div>
        
    </div>
  )
}

export default UserExp