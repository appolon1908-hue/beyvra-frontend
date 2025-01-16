import MetaTrader4Landing from './metaTrader4Landing/MetaTrader4'
import TradingExperience from '../components/experience/TradingExperience'
import imageBgEve from '../../../../assets/trading/meta-trader-4-eve-img.png'
import MetaTradingComponent from '../components/metaTrading/MetaTrading'
import CTABanner from '../components/call-to-action/CTABanner'
import RegisterBlock from 'pages/public/markets/components/registerBlock/RegisterBlock'
import Footer from 'pages/public/home/main/footer/Footer'
import NeedMoreInfo from 'pages/public/markets/components/needMoteInfo/NeedMoreInfo'
import './meta-4.scss'
import {NeedMoreInfoData} from './data'
import TradingCardInfo from 'pages/public/trading/components/tradingCardInfo/TradingCardInfo'
import fastExIcon from  '../../../../assets/trading/meta-icon-2-bg.png'
import intuitiveIcon from '../../../../assets/trading/meta-icon-3-bg.png'
import algoIcon from "../../../../assets/trading/meta-icon-1-bg.png"
import { useTranslation } from 'react-i18next'
// import 
const MetaTrading4 = () => {
    const {t} = useTranslation()
    const items = [{
        title: t("benefitTitle1"),
        text: t("benefitTxt1"),
        icon: algoIcon
    },
    {
        title: (t("benefitTitle2")),
        text: (t("benefitTxt2")),
        icon: fastExIcon
    },
    {
        title: t("benefitTitle3"),
        text: t("benefitTxt3"),
        icon: intuitiveIcon
    }]
  return (
    <div className='tradingContainer meta-4'>
        <MetaTrader4Landing/>
        <TradingExperience  
        image={imageBgEve} 
        title={t("expMeta4Intro")} 
        text={t("expMeta4IntroText")}
        button={true}
        />
    

            <h3>{t("benefitsMT4")}</h3>
            <div className="cardWrapper">
                {items.map(item => (
                    <TradingCardInfo 
                    icon={item.icon}
                    cardTitle={item.title}
                    cardText={item.text}
                    // type='trade'
                    />
                ))}
            </div>

            <div className='bg-theme'>            
                <MetaTradingComponent title={t("tradeUsing4")}
                    body={t("tradeUsing4Text")}
                    type= "mt4"
                />

                <CTABanner/>

            </div>

   
        <NeedMoreInfo items={NeedMoreInfoData} />
        <RegisterBlock/>
        <Footer/>



        
    </div>
  )
}

export default MetaTrading4