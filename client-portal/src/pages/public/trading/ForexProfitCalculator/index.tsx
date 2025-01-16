import React from 'react'
import CostExplanation from '../components/tradingCostExplanation/CostExplanationComp'
import TradingProfitCalculator from '../../../../components/tradingProfitCalculator/TradingProfitCalculator'
import USUKICon from '../../../../assets/trading/UKUS_Oil_2_48e9f9e285.svg fill.png'
import CanIcon from '../../../../assets/trading/canadaflagicon.png'
import BgImage from '../../../../assets/trading/adam-tradingProfit.png'
import BgImageHandleGraph from '../../../../assets/trading/adam-nowakowski-hand-graph-unsplash 2.png'
import ProfitMarginGuide from '../profitMarginGuide/ProfitMarginGuide'
import UkIFlag from '../../../../assets/trading/UK.png'
import TradeAnalyzer from '../components/tradeAnalyzer/TradeAnalyzer'
import '../trading.scss'
import Calculator from '../../../../assets/trading/adam-calculator.png'
import ForexCalculator from 'pages/public/trading/components/forexCalculator/ForexCalculator'
import Navbar from 'pages/public/home/commonComponents/navbar/Navbar'
import TradCalc from 'components/tradCalc/TradCalc'
import { NeedMoreInfoData } from '../platform/data'
import NeedMoreInfo from 'pages/public/markets/components/needMoteInfo/NeedMoreInfo'
import RegisterBlock from 'pages/public/markets/components/registerBlock/RegisterBlock'
import Footer from 'pages/public/home/main/footer/Footer'
import { useTranslation } from 'react-i18next'
const ForexProfitCalculator = () => {
  const {t} = useTranslation()
  return (
    <div className='tradingContainer'>
      <Navbar/>
      <TradCalc withRoute titleHeader='Forex Profit Calculator'/>

      <ForexCalculator mainImg={Calculator} 
          title={t("WhatIsForexProfitCal")} 
          text1={t("whatIsFoxProfitTxt")} 
          text2={t("whatIsFoxProfitTxt2")}/>

      <CostExplanation/>

      <TradingProfitCalculator
             title={t("howForexProfitCalWork")}
             text1={t("howForexProfitCalWorkTxt")}
             text2={t("howForexProfitCalWorkTxt2")}
             icon1={USUKICon}
             image={BgImage}
             icon2={CanIcon}/>
             


      <ProfitMarginGuide
        title={t("howIsProfitCalcInForexTrade")}
        text1={t("howProfitCalcInForexTrdTxt")}
        text2={t("howProfitCalcForexTrdTxt2")}
        icon1={USUKICon}
        image={BgImageHandleGraph}
        icon2={UkIFlag}
        />
         <TradeAnalyzer 
          header={t("forexProfitAnalyzer")}
          text={t("forexProfitAnalyzerTxt")}
          footer={t("forexProfitAnalyzerFooter")}
         />
         <NeedMoreInfo items={NeedMoreInfoData}/>
        <RegisterBlock/>
        <Footer/>


    </div>
  )
}

export default ForexProfitCalculator