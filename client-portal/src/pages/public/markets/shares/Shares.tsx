import "./Shares.scss";

import InfoBlockWithList from "../components/infoBlockWithList/InfoBlockWithList";
import DescriptionBlock from "./descriptionBlock/DescriptionBlock";
import IpoTrading from "./ipoTrading/IpoTrading";
import { InfoBlockWithListData, NeedMoreInfoData } from "./data";
import JoinInThreeSteps from "../components/joinInThreeSteps/JoinInThreeSteps";
import NeedMoreInfo from "../components/needMoteInfo/NeedMoreInfo";
import RegisterBlock from "../components/registerBlock/RegisterBlock";
import TradCalc from "../../../../components/tradCalc/TradCalc";
import Navbar from "pages/public/home/commonComponents/navbar/Navbar";
import HeadIntro from "pages/public/home/commonComponents/headIntro/HeadIntro";
import CategorySlider from "pages/public/home/commonComponents/categorySlider/CategorySlider";
import Footer from "pages/public/home/main/footer/Footer";

import TeslaImage from '../../../../assets/categorySlider/tesla.png'
import AmazonImage from '../../../../assets/categorySlider/amazon.png'
import DeutchBankImage from '../../../../assets/categorySlider/deutchbank.png'
import NavigationRoute from "pages/public/home/commonComponents/NavigationRoute/NavigationRoute";

const Shares = () => {
  const title = 'Shares'
    const detail = "With markets.com we offer leveraged trading on CFD over stocks with low spreads. Trade shares listed in major and minor markets all over the world. Easily long or short individual shares according to your trading decisions and risk apatite."
    const buttonTitle = 'Trade Shares'

    const allPairsData =[
      {
        title: "TESLA",
        subtitle: "TESLA",
        category: "SHARES",
        value: "191.62",
        change: "-2.57%",
        image: TeslaImage
      },
      {
        title: "AMAZON",
        subtitle: "AMZN",
        category: "SHARES",
        value: "174.47",
        change: "0.32%",
        image: AmazonImage
      },
      {
        title: "DEUTSCHEBANK",
        subtitle: "DBN",
        category: "SHARES",
        value: "174.47",
        change: "12.34%",
        image: DeutchBankImage
      }
    ];
  return (
    <div className="sharesContainer">
      <Navbar/>
      <NavigationRoute/>
      <HeadIntro title={title} detail={detail} buttonTitle={buttonTitle} />
      <CategorySlider allPairsData={allPairsData}/>
      <InfoBlockWithList item={InfoBlockWithListData} />
      <DescriptionBlock />
      <IpoTrading />
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

export default Shares;
