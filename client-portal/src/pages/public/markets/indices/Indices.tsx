import "./Indices.scss";
import { InfoBlockWithListData, NeedMoreInfoData } from "./data";

import WaysTrade from "./waysTrade/WaysTrade";
import InfoBlockWithList from "../components/infoBlockWithList/InfoBlockWithList";
import JoinInThreeSteps from "../components/joinInThreeSteps/JoinInThreeSteps";
import NeedMoreInfo from "../components/needMoteInfo/NeedMoreInfo";
import RegisterBlock from "../components/registerBlock/RegisterBlock";
import TradCalc from "../../../../components/tradCalc/TradCalc";
import Navbar from "pages/public/home/commonComponents/navbar/Navbar";
import HeadIntro from "pages/public/home/commonComponents/headIntro/HeadIntro";
import Footer from "pages/public/home/main/footer/Footer";
import CategorySlider from "pages/public/home/commonComponents/categorySlider/CategorySlider";
import TradeTable from "pages/public/home/commonComponents/tradeTable/TradeTable";

import Us30 from '../../../../assets/categorySlider/us30.png'
import Us100 from '../../../../assets/categorySlider/us100.png'
import Sa40 from '../../../../assets/categorySlider/sa40.png'

const Indices = () => {
  const title = 'Indices CFDs'
    const detail = "Trade on the world’s biggest stock markets 24/5 with the most powerful tools, lower spreads and expert analysis."
    const buttonTitle = 'Trade Indices'

    const allPairsData =[
      {
        title: "US30",
        subtitle: "USA 30",
        category: "INDICES",
        value: "39095.25",
        change: "0.88%",
        image: Us30
      },
      {
        title: "US100",
        subtitle: "US Tech 100",
        category: "INDICES",
        value: "15.85",
        change: "-1.96%",
        image: Us100
      },
      {
        title: "SA40",
        subtitle: "South Africa 40",
        category: "INDICES",
        value: "93.85",
        change: "3.44%",
        image: Sa40
      }
    ];
  return (
    <div className="indicesContainer">
      <Navbar />
      <HeadIntro title={title} detail={detail} buttonTitle={buttonTitle} />
      <CategorySlider allPairsData={allPairsData}/>
      <TradeTable/>
      
      <InfoBlockWithList item={InfoBlockWithListData} />
      <WaysTrade />
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

export default Indices;
