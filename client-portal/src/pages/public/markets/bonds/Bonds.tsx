import "./Bonds.scss";
import {
  InfoBlockData,
  InfoBlockWithButtonData,
  NeedMoreInfoData,
} from "./data";

//components
import InfoBlock from "../components/infoBlock/InfoBlock";
import InfoBlockWithButton from "../components/infoBlockWithButton/InfoBlockWithButton";
import JoinInThreeSteps from "../components/joinInThreeSteps/JoinInThreeSteps";
import NeedMoreInfo from "../components/needMoteInfo/NeedMoreInfo";
import RegisterBlock from "../components/registerBlock/RegisterBlock";
import TradCalc from "../../../../components/tradCalc/TradCalc";
import Navbar from "pages/public/home/commonComponents/navbar/Navbar";
import CategorySlider from "pages/public/home/commonComponents/categorySlider/CategorySlider";
import TradeTable from "pages/public/home/commonComponents/tradeTable/TradeTable";
import HeadIntro from "pages/public/home/commonComponents/headIntro/HeadIntro";
import Footer from "pages/public/home/main/footer/Footer";

import USImage from '../../../../assets/categorySlider/us.png'
import UKImage from '../../../../assets/categorySlider/uk.png'

import Graph1Image from '../../../../assets/home/graph1.png'
import Graph2Image from '../../../../assets/home/graph2.png'
import Graph3Image from '../../../../assets/home/graph3.png'
import Graph4Image from '../../../../assets/home/graph4.png'
import NavigationRoute from "pages/public/home/commonComponents/NavigationRoute/NavigationRoute";

const Bonds = () => {
  const title = 'Bonds CFDs'
  const detail = "Take a position on where you think interest rates are heading with our tradeable government bond markets."
  const buttonTitle = 'Trade Bonds CFDs'

  
  const allPairsData =[
    {
      title: "TBOND30",
      subtitle: "US TBond 30",
      category: "BONDS",
      value: "39095.25",
      change: "0.88%",
      image: USImage
    },
    {
      title: "GILT10Y",
      subtitle: "Gilt 10Y Bond",
      category: "BONDS",
      value: "15.85",
      change: "-1.96%",
      image: UKImage
    },
    {
      title: "TNOTE10",
      subtitle: "US TNote 10Y",
      category: "BONDS",
      value: "93.85",
      change: "3.44%",
      image: USImage
    }
  ];

  const data = [
    {  name: 'TBond30', sell: '399.53', buy: '400.23', change: '-2.04%', graph:Graph1Image },
    {  name: 'GYLT10Y', sell: '399.53', buy: '400.23', change: '-1.66%', graph:Graph1Image },
    {  name: 'TNOTE10', sell: '80.90', buy: '80.95', change: '+2.02%', graph:Graph2Image },
    {  name: 'GER10YBOND', sell: '179.63', buy: '180.03', change: '-1.83%', graph:Graph3Image },
  ];
  return (
    <div className="bondsContainer">
    <Navbar/>
      <NavigationRoute/>
      
      <HeadIntro title={title} detail={detail} buttonTitle={buttonTitle} />
      <CategorySlider allPairsData={allPairsData}/>
      <TradeTable data={data}/>

      <InfoBlock item={InfoBlockData} />
      <InfoBlockWithButton item={InfoBlockWithButtonData} />
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

export default Bonds;
