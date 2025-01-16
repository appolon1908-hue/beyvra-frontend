import CostExplanation from '../components/tradingCostExplanation/CostExplanationComp'
import TradeAnalyzer from '../components/tradeAnalyzer/TradeAnalyzer'
import USUKICon from '../../../../assets/trading/uk-circle-2.png'
import CanIcon from '../../../../assets/trading/UKUS_Oil_2_48e9f9e285.svg fill.png'
import GraphBg from '../../../../assets/trading/graphBg.png'
import TradingProfitCalculator from '../../../../components/tradingProfitCalculator/TradingProfitCalculator'
import Navbar from 'pages/public/home/commonComponents/navbar/Navbar'
import TradCalc from 'components/tradCalc/TradCalc'
import { NeedMoreInfoData } from '../platform/data'
import NeedMoreInfo from 'pages/public/markets/components/needMoteInfo/NeedMoreInfo'
import RegisterBlock from 'pages/public/markets/components/registerBlock/RegisterBlock'
import Footer from 'pages/public/home/main/footer/Footer'
import ForexCalculator from 'pages/public/trading/components/forexCalculator/ForexCalculator'
import calculator from '../../../../assets/trading/adam-calculator.png'
import MarginCall from './marginCall/MarginCall'
import HowIsMarginCal from './howIsForexMarginCal/HowIsMarginCal'
import { useTranslation } from 'react-i18next'

const ForexMarginCalculator = () => {
  const {t} = useTranslation()
  return (
    <div className='tradingContainer'>
      <Navbar/>
        <TradCalc withRoute titleHeader='Forex Margin Calculator'/>

        <ForexCalculator 
        mainImg={calculator}
        title={t("whatIsForexMarginCalc")}
        text1={t("whatForexMarginCalcTxt")}/>
        <CostExplanation/>

          <TradingProfitCalculator 
          title={t("whatLeverageTrd")}
          text1={t("whatLeverageTrdTxt")}
          text2={t("whatLeverageTrdTxt2")}
          icon1={USUKICon}
          image={GraphBg}
          icon2={CanIcon}/>

        <MarginCall/>
        <HowIsMarginCal/>
        <TradeAnalyzer
        header={t("reqMarginCallAnalyzerHeader")}
        text={t("reqMarginCallAnalyzerTxt")}
        footer={t("reqMarginCallAnalyzerFooter")}
        />
        <NeedMoreInfo items={NeedMoreInfoData}/>
        <RegisterBlock/>
        <Footer/>
        
    </div>
  )
}

export default ForexMarginCalculator