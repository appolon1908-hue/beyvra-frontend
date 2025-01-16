import "./Commodities.scss";
import { InfoBlockWithListData, NeedMoreInfoData } from "./data";

//components
import CommoditiesUpDown from "./commoditiesUpDown/CommoditiesUpDown";
import CommodityStocks from "./commodityStocks/CommodityStocks";
import JoinInThreeSteps from "../components/joinInThreeSteps/JoinInThreeSteps";
import NeedMoreInfo from "../components/needMoteInfo/NeedMoreInfo";
import RegisterBlock from "../components/registerBlock/RegisterBlock";
import TradCalc from "../../../../components/tradCalc/TradCalc";
import InfoBlockWithList from "../components/infoBlockWithList/InfoBlockWithList";
import Navbar from "pages/public/home/commonComponents/navbar/Navbar";
import Footer from "pages/public/home/main/footer/Footer";
import HeadIntro from "pages/public/home/commonComponents/headIntro/HeadIntro";
import CategorySlider from "pages/public/home/commonComponents/categorySlider/CategorySlider";
import TradeTable from "pages/public/home/commonComponents/tradeTable/TradeTable";

import OilImage from '../../../../assets/categorySlider/oil.png'
import GoldImage from '../../../../assets/categorySlider/gold.png'
import GasImage from '../../../../assets/categorySlider/gas.png'
import NavigationRoute from "pages/public/home/commonComponents/NavigationRoute/NavigationRoute";

const Commodities = () => {
    const title = "commodities"
    const detail = "subCommodities"
    const buttonTitle = "tradeCommodities"

    const allPairsData =[
      {
        title: "ukoil",
        subtitle: "brentOil",
        category: "commodities",
        value: "80.90",
        change: "-2.02%",
        image: OilImage
      },
      {
        title: "gold",
        subtitle: "gold",
        category: "commodities",
        value: "1930.50",
        change: "+0.75%",
        image: GoldImage
      },
      {
        title: "naturalGas",
        subtitle: "naturalGas",
        category: "commodities",
        value: "2.585",
        change: "-1.15%",
        image: GasImage
      }
    ];
  return (
    <div className="commoditiesContainer">
      {/* <UsingOurCfd /> */}
      {/* <CfdTradWhyTrade /> */}
      {/* <CfdTradMuchMore /> */}
      <Navbar/>

      <NavigationRoute/>
      <HeadIntro title={title} detail={detail} buttonTitle={buttonTitle}/>
      <CategorySlider allPairsData={allPairsData} />
      <TradeTable/>
      <CommoditiesUpDown />
      <InfoBlockWithList item={InfoBlockWithListData} />
      <CommodityStocks />
      {/* <TradCalc titleHeader="Forex Margin Calculator" /> */}
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

export default Commodities;
