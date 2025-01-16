import Footer from "pages/public/home/main/footer/Footer"
import NeedMoreInfo from "pages/public/markets/components/needMoteInfo/NeedMoreInfo"
import RegisterBlock from "pages/public/markets/components/registerBlock/RegisterBlock"
import { NeedMoreInfoData } from "./data"
import Navbar from "pages/public/home/commonComponents/navbar/Navbar"
import EconomicCalendarCom from "./economicCalenderTableComp/EconomicCalendar"

const Index = () => {
  
  return (
    <div className='tradingContainer'>
      <Navbar/>
      <EconomicCalendarCom/>
      <NeedMoreInfo items={NeedMoreInfoData}/>
      <RegisterBlock/>
      <Footer/>
    </div>
  )
}

export default Index