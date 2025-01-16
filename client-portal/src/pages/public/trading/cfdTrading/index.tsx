import Navbar from "pages/public/home/commonComponents/navbar/Navbar"
import Footer from "pages/public/home/main/footer/Footer"
import NeedMoreInfo from "pages/public/markets/components/needMoteInfo/NeedMoreInfo"
import RegisterBlock from "pages/public/markets/components/registerBlock/RegisterBlock"
import CfdTradMuchMore from "pages/public/trading/cfdTrading/cfdTradMuchMore/CfdTradMuchMore"
import CfdTradWhyTrade from "pages/public/trading/cfdTrading/cfdTradWhyTrade/CfdTradWhyTrade"
import { NeedMoreInfoData } from "./data"
import JoinInThreeSteps from "pages/public/markets/components/joinInThreeSteps/JoinInThreeSteps"
import CfdTradingBlock from "./cfdTrading/CfdTrading"

const CFDTrading = () => {
  return (
    <div className='tradingContainer'>
      <Navbar/>
    <CfdTradingBlock/>
    <CfdTradWhyTrade/>
    <CfdTradMuchMore/>
    <JoinInThreeSteps/>

    <NeedMoreInfo items={NeedMoreInfoData}/>
    <RegisterBlock/>
    <Footer/>
  </div>
  )
}

export default CFDTrading