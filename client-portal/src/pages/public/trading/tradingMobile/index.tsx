import LandingPageMobile from './LandingPageMobileTrading/LandingPageMobile'
import TradingExperience from '../components/experience/TradingExperience'
import imageBgAdam from '../../../../assets/trading/tradeOnTheGoAdamImg.png'
import Navbar from 'pages/public/home/commonComponents/navbar/Navbar'
import JoinInThreeSteps from 'pages/public/markets/components/joinInThreeSteps/JoinInThreeSteps'
import NeedMoreInfo from 'pages/public/markets/components/needMoteInfo/NeedMoreInfo'
import RegisterBlock from 'pages/public/markets/components/registerBlock/RegisterBlock'
import {NeedMoreInfoData} from './data'
import Footer from 'pages/public/home/main/footer/Footer'
import UserExp from './UserXp/UserXp'
import { useTranslation } from 'react-i18next'
const TradingOnTheGo = () => {
  const {t} = useTranslation()
  return (
    <div className='tradingContainer'>
      <Navbar/>
        <LandingPageMobile/>

        <TradingExperience
          image={imageBgAdam} 
          title={t("expIntro")} 
          text={t("expText")}
          button={false}
        />
        <UserExp />
        <JoinInThreeSteps/>
        <NeedMoreInfo items={NeedMoreInfoData} />
        <RegisterBlock/>
        <Footer/>

    </div>
  )
}

export default TradingOnTheGo