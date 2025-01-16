import TrackTrade from './trackTradeHeader/TrackTrade'
import PerksCard from 'pages/public/trading/components/perksCard/PerksCard'
import TradingSteps from '../components/tradingSteps/TradingSteps'
import ProfileCard from './profileCard/ProfileCard'
import CopyTrade from '../components/copyTrade/CopyTrade'
import '../trading.scss'
import Navbar from 'pages/public/home/commonComponents/navbar/Navbar'
import NeedMoreInfo from 'pages/public/markets/components/needMoteInfo/NeedMoreInfo'
import Footer from 'pages/public/home/main/footer/Footer'
import { NeedMoreInfoData } from './data'
import BenefitList from './tradeBenefits/BenefitCard'
import './trackTrade.scss'
import { useState } from 'react'
import Follower from './followers/Follower'
import CopyTrader from './copyTraders/CopyTrader'
import { useTranslation } from 'react-i18next'

const TrackTrades = () => {
    const {t} = useTranslation()
    

    
    const benefits = [{
        title: t("benefitTitle1"),
        text: t("benefitTxt1")
    },{
        title: t("benefitTitle2"),
        text: t("benefitTxt2")
    },{
        title: t("benefitTitle3"),
        text: t("benefitTxt13")
    },{
        title: t("benefitTitle4"),
        text: t("benefitTxt14")
    },{
        title: t("benefitTitle5"),
        text: t("benefitTxt5")
    },{
        title: t("benefitTitle6"),
        text: t("benefitTxt6")
    },
   ]

    const [activity, setActivity] = useState("follower")
    const handleClick = (btn: string) => {
      setActivity(btn)
    }
  return (
    <div className='tradingContainer copyTradingWrapper'>
        <Navbar/>
        <TrackTrade />
        <CopyTrade />


        <div className='activityContainer'>
            <div className='btnWrapper'>           
                <button onClick={()=> handleClick("follower")} className={`${activity == "follower" && "active"}`}> {t("followerBtn")}</button>
                <button onClick={()=> handleClick("copy_trader")} className={`${activity == "copy_trader" && "active"}`}>{t("copyTraderBtn")} </button>
            </div>

            {activity == "follower" ? (<>
            <Follower/>
                
            </>) : (<>
            <CopyTrader/>
            </>)}     


        </div>
           
     
       <div className="container benefitWrapper">
            <div className='profileCardInfo'>
                <ProfileCard/>

            </div>

            <div className=' benefitListWrapper'>
                {benefits.map(benefit => (
                    <BenefitList title={benefit.title} text={benefit.text}/>
                ))}


            </div>
        </div>
        <NeedMoreInfo items={NeedMoreInfoData}/>
        <Footer/>
    </div>
  )
}

export default TrackTrades