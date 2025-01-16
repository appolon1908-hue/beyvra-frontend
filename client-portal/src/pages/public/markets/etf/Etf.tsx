import "./Etf.scss";
import { InfoBlockWithListData, NeedMoreInfoData } from "./data";

//components
import Header from "./header/Header";
import EtfOpportunities from "./etfOpportunities/EtfOpportunities";
import InfoBlockWithList from "../components/infoBlockWithList/InfoBlockWithList";
import JoinInThreeSteps from "../components/joinInThreeSteps/JoinInThreeSteps";
import NeedMoreInfo from "../components/needMoteInfo/NeedMoreInfo";
import RegisterBlock from "../components/registerBlock/RegisterBlock";
import TradCalc from "../../../../components/tradCalc/TradCalc";
import Navbar from "pages/public/home/commonComponents/navbar/Navbar";
import HeadIntro from "pages/public/home/commonComponents/headIntro/HeadIntro";
import CategorySlider from "pages/public/home/commonComponents/categorySlider/CategorySlider";
import TradeTable from "pages/public/home/commonComponents/tradeTable/TradeTable";
import Footer from "pages/public/home/main/footer/Footer";


import Graph1Image from '../../../../assets/home/graph1.png'
import Graph2Image from '../../../../assets/home/graph2.png'
import Graph3Image from '../../../../assets/home/graph3.png'
import Graph4Image from '../../../../assets/home/graph4.png'

import EtfImage from '../../../../assets/categorySlider/ETF.png'
import NavigationRoute from "pages/public/home/commonComponents/NavigationRoute/NavigationRoute";

const Etf = () => {
  const title = 'ETFs'
    const detail = "Trade CFD ETFs - Exchange Traded Funds – to gain exposure to a wide range of stock markets, sectors, commodities, bonds and currencies. Buy the ones you like, short the ones you don’t."
    const buttonTitle = 'Trade ETFs'

    const allPairsData =[
      {
        title: "FTGC",
        subtitle: "First Trust Global Com",
        category: "ETF",
        value: "80.90",
        change: "-2.02%",
        image: EtfImage
      },
      {
        title: "INVESCO",
        subtitle: "Invesco",
        category: "ETF",
        value: "80.90",
        change: "-2.02%",
        image: EtfImage
      },
      {
        title: "DELLTECH",
        subtitle: "Dell",
        category: "ETF",
        value: "1.579",
        change: "-7.44%",
        image: EtfImage
      }
    ];
    const data = [
      {  name: 'Trade WisdomTree', sell: '399.53', buy: '400.23', change: '-2.04%', graph:Graph1Image },
      {  name: 'Internet ETF', sell: '399.53', buy: '400.23', change: '-1.66%', graph:Graph1Image },
      {  name: 'Taiwan MSCI', sell: '80.90', buy: '80.95', change: '+2.02%', graph:Graph2Image },
      {  name: 'QQQ Ultra Pro', sell: '179.63', buy: '180.03', change: '-1.83%', graph:Graph3Image },
      {  name: 'Sprot Physical', sell: '81.69', buy: '81.74', change: '+2.06%', graph:Graph4Image },
    ];
  return (
    <div className="etfContainer">
      <Navbar/>
      <NavigationRoute/>
      <HeadIntro title={title} detail={detail} buttonTitle={buttonTitle} />
      <CategorySlider allPairsData={allPairsData}/>
      <TradeTable data={data}/>
      <Header />
      <EtfOpportunities />
      <InfoBlockWithList item={InfoBlockWithListData} />
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

export default Etf;
