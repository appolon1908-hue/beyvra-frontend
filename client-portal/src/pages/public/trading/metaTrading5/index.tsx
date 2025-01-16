import MetaTrader5Landing from './metaTrader5/MetaTrader5Landing'
import TradingExperience from '../components/experience/TradingExperience'
import imageBgAdamLp from '../../../../assets/trading/adam-meta-trader-5.png'
import PerksCard from 'pages/public/trading/components/perksCard/PerksCard'
import MetaTradingComponent from '../components/metaTrading/MetaTrading'
import CTABanner from '../components/call-to-action/CTABanner'
import Navbar from 'pages/public/home/commonComponents/navbar/Navbar'
import NeedMoreInfo from 'pages/public/markets/components/needMoteInfo/NeedMoreInfo'
import RegisterBlock from 'pages/public/markets/components/registerBlock/RegisterBlock'
import Footer from 'pages/public/home/main/footer/Footer'
import "./meta-5.scss"
import {NeedMoreInfoData} from './data'
import TradingCardInfo from 'pages/public/trading/components/tradingCardInfo/TradingCardInfo'
import mgmtIcon from '../../../../assets/trading/meta-icon-1-bg.png'
import algoIcon from '../../../../assets/trading/meta-icon-2-bg.png'
import moreIcon from '../../../../assets/trading/meta-icon-3-bg.png'
import { useTranslation } from 'react-i18next'
const MetaTrading5 = () => {
    const {t} = useTranslation()
    const items = [{
        title: t("m5benefitTitle1"),
        text: t("m5benefitTxt1"),
        icon: mgmtIcon
    },
    {
        title: t("m5benefitTitle2"),
        text:  t("m5benefitTxt2"),
        icon: algoIcon
    },
    {
        title: t("m5benefitTitle3"),
        text: t("m5benefitTxt3"),
        icon: moreIcon
    }]
  return (
    <div className='tradingContainer meta-5'>
        <MetaTrader5Landing/>
        <TradingExperience  
            image={imageBgAdamLp} 
            title={t("expMeta5Intro")} 
            text={t("expMeta5IntroText")}
            button={true}
            />

        <h3>{t("benefiitM5")}</h3>

        <div className="cardWrapper">
            {items.map(item => (
                <TradingCardInfo 
                icon={item.icon}
                cardTitle={item.title}
                cardText={item.text}
                />
            ))}

        </div>
        <div className='bg-theme'>            

        <MetaTradingComponent title={t("tradeUsing5")}
            body={t("tradeUsing5txt")}
            type= "mt5"
        />
        <CTABanner/>
        </div>

        <NeedMoreInfo items={
            NeedMoreInfoData
        } />
        <RegisterBlock/>
        <Footer/>
    </div>
  )
}

export default MetaTrading5