import TradCalc from 'components/tradCalc/TradCalc'
import Footer from 'pages/public/home/main/footer/Footer'
import NeedMoreInfo from 'pages/public/markets/components/needMoteInfo/NeedMoreInfo'
import RegisterBlock from 'pages/public/markets/components/registerBlock/RegisterBlock'
import UsingOurCfd from 'pages/public/trading/cfdTrading/usingOurCfd/UsingOurCfd'
import { NeedMoreInfoData } from './data'
import Header from './expDateHeader/Header'
import TradeTableExp from './tradeTable/TradeTableExp'
import Navbar from 'pages/public/home/commonComponents/navbar/Navbar'

const ExpirationDates = () => {
  return (
    <div className='tradingContainer expirationDate'>
      <Navbar/>
    <Header/>
    <TradeTableExp/>
    <TradCalc/>
    <UsingOurCfd/>
    <NeedMoreInfo items={NeedMoreInfoData}/>
    <RegisterBlock/>
    
    <Footer/>
  </div>
  )
}

export default ExpirationDates