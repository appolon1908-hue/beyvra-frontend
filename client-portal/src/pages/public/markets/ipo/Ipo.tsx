import "./Ipo.scss";
import { WhyTradeIPOs, HowItWorks, IPOStocks, NeedMoreInfoData } from "./data";

//components
import InfoBlock from "../components/infoBlock/InfoBlock";
import CapitalIPO from "./capitalIPO/CapitalIPO";
import InfoBlockWithButton from "../components/infoBlockWithButton/InfoBlockWithButton";
import JoinInThreeSteps from "../components/joinInThreeSteps/JoinInThreeSteps";
import NeedMoreInfo from "../components/needMoteInfo/NeedMoreInfo";
import RegisterBlock from "../components/registerBlock/RegisterBlock";
import TradCalc from "../../../../components/tradCalc/TradCalc";
import Navbar from "pages/public/home/commonComponents/navbar/Navbar";
import Footer from "pages/public/home/main/footer/Footer";
import HeadIntro from "pages/public/home/commonComponents/headIntro/HeadIntro";
import NavigationRoute from "pages/public/home/commonComponents/NavigationRoute/NavigationRoute";

 const Ipo = () => {
  const title = 'IPOs CFDs'
  const detail = "Trade on the hottest companies going public with our IPO markets."
  const buttonTitle = 'Trade IPOs'
  return (
    <div className="ipoContainer">
      <Navbar/>
      <NavigationRoute/>
      <HeadIntro title={title} detail={detail} buttonTitle={buttonTitle} />
    
      <InfoBlock item={WhyTradeIPOs} />
      <InfoBlockWithButton item={IPOStocks} />
      <InfoBlock item={HowItWorks} />
      <CapitalIPO />
      <div className="revertCompanents">
        <TradCalc />
        <JoinInThreeSteps />
      </div>
      <NeedMoreInfo items={NeedMoreInfoData} />
      <RegisterBlock />
      <Footer/>
    </div>
  );
};

export default Ipo