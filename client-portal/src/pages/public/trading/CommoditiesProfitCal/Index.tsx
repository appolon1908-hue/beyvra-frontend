import CostExplanation from '../components/tradingCostExplanation/CostExplanationComp'
import TradeAnalyzer from '../components/tradeAnalyzer/TradeAnalyzer'
import "../trading.scss"
import comIcon from '../../../../assets/trading/commIcon.png'
import CanIcon from '../../../../assets/trading/canadaflagicon.png'
import BgImage from '../../../../assets/trading/adam-green-farm-note.png'
import TradingProfitCalculator from '../../../../components/tradingProfitCalculator/TradingProfitCalculator'
import Navbar from 'pages/public/home/commonComponents/navbar/Navbar'
import NeedMoreInfo from 'pages/public/markets/components/needMoteInfo/NeedMoreInfo'
import RegisterBlock from 'pages/public/markets/components/registerBlock/RegisterBlock'
import Footer from 'pages/public/home/main/footer/Footer'
import { NeedMoreInfoData } from './data'
import NavigationRoute from 'pages/public/home/commonComponents/NavigationRoute/NavigationRoute'

import traderBg from "../../../../assets/trading/busy-trader.png"
import ForexCalculator from 'pages/public/trading/components/forexCalculator/ForexCalculator'
import TradCalc from 'components/tradCalc/TradCalc'
import CommodityCalculator from './commodityCalculator/CommodityProfitCalculator'
import ProfitLossCal from './commodityCalculator/ProfitLossCalculator'
import { useTranslation } from 'react-i18next'

const CommoditiesProfitCalc = () => {
  const {t} = useTranslation()
  return (
    <div className='tradingContainer'>
      <Navbar/>
      <TradCalc withRoute titleHeader='Commodities Profit Calculator'/>

        <ForexCalculator mainImg={traderBg}

          title={t("whatIsComCal")}
          text1={t("whatIsComCalText")}


          text2={t("whatIsComCalText2")}/>
    
      

        <CostExplanation/>

        <CommodityCalculator 
          title={t("HowComWork")}
          text1={t("howComWorkText")}

          text2={t("howComWorkCalWork2")}
          

          icon1={comIcon}
          image={BgImage}
          />
          <ProfitLossCal />
          <TradeAnalyzer header={t("comAnlyzerComp")}
          text={t("comAnlyzerTxt")}
          footer={t("comAnalyzerFootNote")}

          />
  

        <NeedMoreInfo items={NeedMoreInfoData}/>
        <RegisterBlock/>
        <Footer/>
        
    </div>
  )
}

export default CommoditiesProfitCalc