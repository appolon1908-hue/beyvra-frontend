import './checkCurrency.scss'

import AppleIcon from '../../../../../assets/home/checkCurrency/Apple.png'
import TeslaIcon from '../../../../../assets/home/checkCurrency/Tesla.png'
import Avalanche from '../../../../../assets/home/checkCurrency/Avalanche.png'
import BNB from '../../../../../assets/home/checkCurrency/BNB.png'
import Chainlink from '../../../../../assets/home/checkCurrency/Chainlink.png'
import DAI from '../../../../../assets/home/checkCurrency/DAI.png'
import GRT from '../../../../../assets/home/checkCurrency/GRT.png'
import Nvidia from '../../../../../assets/home/checkCurrency/Nvidia.png'
import Oil from '../../../../../assets/home/checkCurrency/Oil.png'
import Polkadot from '../../../../../assets/home/checkCurrency/Polkadot.png'
import Polygon from '../../../../../assets/home/checkCurrency/Polygon.png'
import Wallmart from '../../../../../assets/home/checkCurrency/Wallmart.png'
import YFI from '../../../../../assets/home/checkCurrency/YFI-USD.png'
import Cardano from '../../../../../assets/home/checkCurrency/Cardano.png'

import ProfileNumberIcon from '../../../../../assets/home/checkCurrency/profileNumberIcon.png'
import TradeNumberIcon from '../../../../../assets/home/checkCurrency/tradeNumberIcon.png'
import VolumeNumberIcon from '../../../../../assets/home/checkCurrency/volumeNumberIcon.png'



import CheckCurrecnyCard from './CheckCurrecnyCard'
import { useTranslation } from 'react-i18next'

const CheckCurrency = () => {
  const firstLayerData = [
    {
      name:"Tesla",
      price:"$2900.34",
      trade:"+0.17%",
      imgSrc:TeslaIcon,
      tradeColor:"#00B67A"
    },
    {
      name:"Apple",
      price:"$169.99",
      trade:"+0.27%",
      imgSrc:AppleIcon,
      tradeColor:"#00B67A"
    },
    {
      name:"GRT",
      price:"$0.29",
      trade:"+0.81%",
      imgSrc:GRT,
      tradeColor:"#00B67A"
    },
    {
      name:"Oil Brent",
      price:"$81.28",
      trade:"-0.69%",
      imgSrc:Oil,
      tradeColor:"#FF1802"
    },
    {
      name:"Cardano",
      price:"$19.71",
      trade:"+0.93%",
      imgSrc:Cardano,
      tradeColor:"#00B67A"
    },
    {
      name:"chainlink",
      price:"$19.71",
      trade:"+0.93%",
      imgSrc:Chainlink,
      tradeColor:"#00B67A"
    },
    {
      name:"Polkadot",
      price:"$180.11",
      trade:"+0.33%",
      imgSrc:Polkadot,
      tradeColor:"#00B67A"
    },
    {
      name:"YFI-USD",
      price:"$9,262",
      trade:"+0.27%",
      imgSrc:YFI,
      tradeColor:"#00B67A"
    },
    {
      name:"BNB",
      price:"$406.65",
      trade:"-1.51%",
      imgSrc:BNB,
      tradeColor:"#FF1802"
    },
    {
      name:"Polygon",
      price:"$1.09",
      trade:"+2.60%",
      imgSrc:Polygon,
      tradeColor:"#00B67A"
    },
    {
      name:"Walmart",
      price:"$290.34",
      trade:"+0.41%",
      imgSrc:Wallmart,
      tradeColor:"#00B67A"
    },
    {
      name:"DAI",
      price:"$0.997",
      trade:"+0.41%",
      imgSrc:DAI,
      tradeColor:"#00B67A"
    },
    {
      name:"Avalanche",
      price:"$42.02",
      trade:"-2.30%",
      imgSrc:Avalanche,
      tradeColor:"#FF1802"
    },
    {
      name:"Nvidia",
      price:"$848.0",
      trade:"+0.50%",
      imgSrc:Nvidia,
      tradeColor:"#00B67A"
    },
  ]
  const {t} = useTranslation()

  return (
    <div className="checkCurrencyContainer">
        <div className="checkCurrencyHeader">
            <h2>{t('checkOur')}</h2>
            <h2>{t("mostTradedCurrencyPairs")} </h2>
        </div>
        <div className='checkCurrencyCardContainer'>
          {
            firstLayerData.map((card)=>{
              return <CheckCurrecnyCard 
              imgSrc={card.imgSrc} 
              name={card.name} 
              price={card.price} 
              trade={card.trade} 
              tradeColor={card.tradeColor}/>
            })
          }
            
        </div>
        <div className='tradersNumber'>
          <h2>{t("4.7MillionTraders")}</h2>
          <div className='traderCards'>
          {/* card */}
          <div className='tradeNumberCard'>
            <div className='tradeCardNumberHeader'>
              <img src={ProfileNumberIcon} alt="" />
              <span>{t('activeTraders')}</span>
            </div>
            <h2>1,432,884</h2>
          </div>
          {/* card */}
          <div className='tradeNumberCard'>
            <div className='tradeCardNumberHeader'>
              <img src={VolumeNumberIcon} alt="" />
              <span>{t('totalVolume')}</span>
            </div>
            <h2>60,827,147,559</h2>
          </div>
          {/* card */}
          <div className='tradeNumberCard'>
            <div className='tradeCardNumberHeader'>
              <img src={TradeNumberIcon} alt="" />
              <span>{t('totalTrades')}</span>
            </div>
            <h2>1,432,884</h2>
          </div>


          </div>

        </div>
    </div>
  )
}

export default CheckCurrency