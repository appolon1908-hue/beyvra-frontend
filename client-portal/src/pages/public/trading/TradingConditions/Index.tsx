import Navbar from 'pages/public/home/commonComponents/navbar/Navbar'
import TradeTable from 'pages/public/home/commonComponents/tradeTable/TradeTable'
import Footer from 'pages/public/home/main/footer/Footer'
import Header from './conditionHeader/Header'

const TradingConditions = () => {
  return (
    <div className='tradingContainer'>
      <Navbar/>
    <Header/>
    <TradeTable/>
    
    <Footer/>
  </div>
  )
}

export default TradingConditions