import {
  DropdownIcon,
  FilterBarsIcon,
  QuestionMarkIcon,
  StarFavouriteIcon,
  TradesIcon3,
} from "../../../../../assets/icons";
import "./tradesMenu.scss";
import ArrowsSlider from "../../../../../components/arrowsSlider/ArrowsSlider";
import {  useEffect, useState } from "react";
import { Col, Row, Select } from "antd";
import SearchBar from "../../../../../components/searchBar/SearchBar";
import { forex } from "../assets/assetsData";
import { Dispatch, SetStateAction } from "react";
import { LeftSubDrawer } from "../../types";
import {  setAssetPairs, setSelectedAssetPair } from "@store/slices/pairs";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import useTradeList from "api/wallet/useTradeList";
import { useCookies } from "react-cookie";
import { TradeStates } from "@store/slices/trade";
import useCrptoMarketData from "api/portfolio/cryptoMarket";
import Loading from "components/loading";
import useMarketData from "api/marketData/useMarketData";
import useStockMarketData from "api/portfolio/stockMarket";

interface TradesMenuProps {
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>;
  setIsLeftSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const RenderTab = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const [part1, part2] = description.split(" on ");
  const {themeSelect} = useAppSelector(state => state.themeBg)


  return (
    <div className={`${themeSelect} tradesMenuWrapper`}>
      <p className="tradeHeading">{title}</p>
      <div className="tradeIconWrapper">
        <TradesIcon3 />
      </div>
      <p className="noTrade">{part1} on</p>
      <p className="noTrade">{part2}</p>
    </div>
  );
};

const RenderData: React.FunctionComponent = (props: any) => {
  const {themeSelect} = useAppSelector(state => state.themeBg)
  const [selectedButton, setSelectedButton] = useState(1)
  const {handleMenuClick, marketData, isPending} = props;
  const dispatch = useAppDispatch();

  const itemsPerPage = 100

  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage 
const currentItems = marketData.slice(indexOfFirstItem, indexOfLastItem)


const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  
  const {selectedForexTrade, forexData } = useAppSelector(
    (state: { trades: TradeStates }) => state.trades
  );

  

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    // setIsLeftSubDrawerOpen(false)
  };
  const handleSelectedForex =(item: any) => {
    console.log(item);
    // dispatch(setAssetPairs(item))
    // dispatch(selectedForexTrade(item))
  };
  const style = {
    color: themeSelect == "night" ?  "#fff" : "#000",
    backgroundColor: themeSelect == "night" ?  "#000" : "#fff",
  }

  const handlePage = (index: number) => {
    paginate(index + 1)
  }

  if(isPending){
    return(<Loading/>)
  }
  return (
    <div className={`${themeSelect} tradesAssetMenu`}>
      <p className="tradeHeading" style={{color: style.color}}>Active Trades</p>;
      <SearchBar className={`assetsSearchbar ${themeSelect}` } />
      <div className="assetsFilters">
        <div className={`${themeSelect} filterButton`}>
          <StarFavouriteIcon /> Favorites
        </div>
        <Select
          className={`${themeSelect} filterSelectlist`}
          defaultValue="any"
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: "any", label: "Any profitability" },
            { value: "25", label: "25%" },
            { value: "50", label: "50%" },
            { value: "85", label: "85%" },
            { value: "100", label: "100%" },
          ]}
          suffixIcon={<DropdownIcon />}
          popupClassName="assetsDropdown"
        />
        <Select
          className={`${themeSelect == "night"  ? "night" : themeSelect == "day" ? 'day': ""} filterSelectlist `}
          defaultValue="any"
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: "any", label: "Asset Type" },
            { value: "25", label: "25%" },
            { value: "50", label: "50%" },
            { value: "85", label: "85%" },
            { value: "100", label: "100%" },
          ]}
          suffixIcon={<DropdownIcon />}
          popupClassName="assetsDropdown"
        />
      </div>
      <Row className={`assetsList ${themeSelect}`} gutter={[2, 2]} justify="start">
        <Col span={12} className="assetsListCol">
          <div className="assetsColIcon barsIcon">
            <FilterBarsIcon />
          </div>
          <p className="assetsListColTitle">Name, Mid Price</p>
        </Col>

        <Col span={12} className="assetsListCol alignEnd">
          <p className="assetsListColTitle">24-hr changes</p>
        </Col>

        {currentItems?.map((item: any, index: any) => (
          <Col span={24} key={`assetListItem ${item.value + "_" + index}`}>
            <div
              className={`assetsListItem ${themeSelect}  ${
                selectedForexTrade === item.value ? "active" : ""
              }`}
              onClick={() => handleSelectedForex(item)}
            >
              <div className="contentLeft">
                <img src={"cryptoIcon.svg"} alt="flag" />
                <p className="itemTitle">
                {item.T.includes(":") ? item.T.split(":")[1] : item.T}
                </p>
              </div>
              <div className="contentRight">
                <p
                  className={`itemText ${
                    (((item.c - item.o)/item.o)* 100) >0 ? "success" : "danger"
                  }`}
                >

                  {(((item.c - item.o)/item.o)* 100).toFixed(2)}%
                </p>
                <QuestionMarkIcon />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <ul className="bg-red-50/10 my-2 flex flex-wrap gap-2 ">
        {Array.from({length: Math.ceil(marketData.length/itemsPerPage)}, (_, index) => (
          <li key={index} className="flex">
            <button  onClick={()=>{paginate(index + 1); setSelectedButton(index)}} className={`${selectedButton == index ? "bg-slate-700": "bg-slate-500"} text-white px-2 py-1  rounded`}>
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RenderFixedTime: React.FunctionComponent = ({handleMenuClick}: any) =>{
  const [cookies] = useCookies(["access_token"]);

  const [cryptoMarket, setcryptoMarket] = useState<any[]>([])

  const {mutate, data, isPending} = useCrptoMarketData({onSuccess: (data) => { setcryptoMarket(data?.results)}, onError: () => { }})

  useEffect(()=> {
    mutate({
      token: cookies.access_token
    })

  },[cookies.access_token, mutate])
  return(
  <RenderTab
    title="Active Trades"
    description="You have no open trades on this account"
  />
  // @ts-ignore
  // <RenderData handleMenuClick={handleMenuClick} marketData={cryptoMarket} isPending={isPending}/>
);
}
const RenderForex = ({handleMenuClick}: any) => {
  const [cookies] = useCookies(["access_token"]);

  const [cryptoMarket, setcryptoMarket] = useState<any[]>([])

  const {mutate, data, isPending} = useCrptoMarketData({onSuccess: (data) => { setcryptoMarket(data?.results)}, onError: () => { }})

  useEffect(()=> {
    mutate({
      token: cookies.access_token
    })

  },[cookies.access_token, mutate])
  return(

  // @ts-ignore
    // <RenderData handleMenuClick={handleMenuClick} marketData={cryptoMarket} isPending={isPending}/>
  <RenderTab
    title="Forex"
    description="You have no open Forex Trades on this account"
  />
);

}
const RenderStocks = ({handleMenuClick}: any) => {
  const [cookies] = useCookies(["access_token"]);

  const [stockskMarket, setStocksMarket] = useState<any[]>([])

  const {mutate, data, isPending} = useStockMarketData({onSuccess: (data) => { setStocksMarket(data?.results)}, onError: () => { }})

  useEffect(()=> {
    mutate({
      token: cookies.access_token
    })

  },[cookies.access_token, mutate])
  return(
      // @ts-ignore

    <RenderData handleMenuClick={handleMenuClick} marketData={stockskMarket} isPending={isPending}/>

);
}
const RenderCommodities = () => (
  <RenderTab
    title="Commodities"
    description="You have no open Commodity Trades on this account"
  />
);
const RenderCrypto = ({handleMenuClick}: any) => {
  const [cookies] = useCookies(["access_token"]);
  const [cryptoMarket, setcryptoMarket] = useState<any[]>([])


  const {mutate, data, isPending} = useCrptoMarketData({onSuccess: (data) => { setcryptoMarket(data?.results)}, onError: () => { }})

  useEffect(()=> {
    mutate({
      token: cookies.access_token
    })
  },[cookies.access_token, mutate])
  return(
    
    // @ts-ignore
    <RenderData handleMenuClick={handleMenuClick} marketData={cryptoMarket} isPending={isPending} />

  // <RenderTab
  //   title="Crypto"
  //   description="You have no open Crypto Trades on this account"
  // />
);
}
const RenderBonds = () => (
  <RenderTab
    title="Bonds"
    description="You have no open Bond Trades on this account"
  />
);
const RenderIPOs = () => (
  <RenderTab
    title="IPOs"
    description="You have no open IPO Trades on this account"
  />
);


const TradesMenu: React.FunctionComponent<TradesMenuProps> = ({
  setLeftSubDrawer,
  setIsLeftSubDrawerOpen,
  setIsDrawerOpen,
}) => {
  const [selectedTab, setSelectedTab] = useState("fixed");
  const {themeSelect} = useAppSelector(state => state.themeBg)

 

  const handleButtonClick = (buttonName: string) => {
    setSelectedTab(buttonName);
    // setLeftSubDrawer(item?.path);
  };
  const handleMenuClick = () => {
    setIsLeftSubDrawerOpen(false);
    setIsDrawerOpen(false);
  };
  
  const items = [
    {
      key: "1",
      tab: "Fixed Time",
      label: "fixed",
      // @ts-ignore
      component: <RenderFixedTime handleMenuClick={handleMenuClick} />,
    },
   
    {
      key: "3",
      tab: "Stocks",
      label: "stocks",
      component: <RenderStocks  handleMenuClick={handleMenuClick} />,
    },
   
    {
      key: "5",
      tab: "Crypto",
      label: "crypto",
      component: <RenderCrypto  handleMenuClick={handleMenuClick} />,
    },
    {
      key: "2",
      tab: "Forex",
      label: "forex",
      component: <RenderForex handleMenuClick={handleMenuClick} />,
    },
    {
      key: "4",
      tab: "Commodities",
      label: "commodities",
      component: <RenderCommodities />,
    },
    {
      key: "6",
      tab: "Bonds",
      label: "bonds",
      component: <RenderBonds />,
    },
    {
      key: "7",
      tab: "IPOs",
      label: "ipos",
      component: <RenderIPOs />,
    },
  ];
  

  return (
    <div className={`${themeSelect} tradesMenu`}>
      <ArrowsSlider>
        <div className="slider">
          {items.map((item) => (
            <button
              className={selectedTab === item.label ? "active" : ""}
              onClick={() => handleButtonClick(item.label)}
            >
              {item.tab}
            </button>
          ))}
        </div>
      </ArrowsSlider>
      <div className="tradesMenuContent">
        {items.map((item) => {
          if (item.label === selectedTab) {
            const TabComponent = item.component;
          
            return(
              <>
               {item.component}
              </>
            )
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default TradesMenu;
