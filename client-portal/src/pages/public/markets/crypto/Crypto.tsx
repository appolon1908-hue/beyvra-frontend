import "./Crypto.scss";
import { InfoBlockWithListData, NeedMoreInfoData } from "./data";

import InfoBlockWithList from "../components/infoBlockWithList/InfoBlockWithList";
import JoinInThreeSteps from "../components/joinInThreeSteps/JoinInThreeSteps";
import NeedMoreInfo from "../components/needMoteInfo/NeedMoreInfo";
import RegisterBlock from "../components/registerBlock/RegisterBlock";
import TradCalc from "../../../../components/tradCalc/TradCalc";
import Navbar from "pages/public/home/commonComponents/navbar/Navbar";
import HeadIntro from "pages/public/home/commonComponents/headIntro/HeadIntro";
import CategorySlider from "pages/public/home/commonComponents/categorySlider/CategorySlider";

import BitCoinImage from '../../../../assets/categorySlider/bitcoin.png'
import EthereumImage from '../../../../assets/categorySlider/ethereum.png'
import RippleImage from '../../../../assets/categorySlider/ripple.png'
import NavigationRoute from "pages/public/home/commonComponents/NavigationRoute/NavigationRoute";

const Crypto = () => {
  const title = 'Cryptocurrency CFDs'
  const detail = "Take advantage of the volatility and trade CFD on cryptos with markets.com. Go long or short, trade on margin."
  const buttonTitle = 'Trade Commodities'

  const allPairsData =[
    {
      title: "BITCOIN",
      subtitle: "BITCOIN",
      category: "C",
      value: "80.90",
      change: "-2.02%",
      image: BitCoinImage
    },
    {
      title: "RIPPLE",
      subtitle: "XRP",
      category: "C",
      value: "80.90",
      change: "-2.02%",
      image: RippleImage
    },
    {
      title: "ETHEREUM",
      subtitle: "ETH",
      category: "C",
      value: "1.579",
      change: "-7.44%",
      image: EthereumImage
    }
  ];
  return (
    <div className="cryptoContainer">
      <Navbar/>
      <NavigationRoute/>
      <HeadIntro title={title} detail={detail} buttonTitle={buttonTitle} />
      <CategorySlider allPairsData={allPairsData}/>
      <InfoBlockWithList item={InfoBlockWithListData} />
      <div className="revertCompanents">
        <TradCalc />
        <JoinInThreeSteps />
      </div>
      <NeedMoreInfo items={NeedMoreInfoData} />
      <RegisterBlock />
    </div>
  );
};

export default Crypto;
