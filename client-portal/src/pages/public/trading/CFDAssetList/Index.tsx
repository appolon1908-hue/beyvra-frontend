import TradCalc from 'components/tradCalc/TradCalc'
import Navbar from 'pages/public/home/commonComponents/navbar/Navbar'
import TradeTableAsset from './tradeTable/TradeTableExp'
import NeedMoreInfo from 'pages/public/markets/components/needMoteInfo/NeedMoreInfo'
import UsingOurCfd from 'pages/public/trading/cfdTrading/usingOurCfd/UsingOurCfd'
import { NeedMoreInfoData } from './data'
import RegisterBlock from 'pages/public/markets/components/registerBlock/RegisterBlock'
import Footer from 'pages/public/home/main/footer/Footer'
import Header from './cfdassetHeader/Header'

const CFDAssetList = () => {
  return (
    <div className='tradingContainer'>
      <Navbar/>
      <Header/>
      <TradeTableAsset/>
      <TradCalc/>
      <UsingOurCfd/>
      <NeedMoreInfo items={NeedMoreInfoData}/>
      <RegisterBlock/>
      <Footer/>
    </div>
  )
}

export default CFDAssetList