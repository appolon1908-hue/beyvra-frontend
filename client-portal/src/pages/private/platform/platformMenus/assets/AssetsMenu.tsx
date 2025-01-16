import { Col, Row, Select } from "antd";
import SearchBar from "../../../../../components/searchBar/SearchBar";
import "./assetsMenu.scss";
import {
  DropdownIcon,
  FilterBarsIcon,
  InfoCircleIconSmall,
  QuestionMarkIcon,
} from "../../../../../assets/icons";
import { useState } from "react";
import { forex, stocks, times } from "./assetsData";
import ArrowsSlider from "../../../../../components/arrowsSlider/ArrowsSlider";
import { useAppDispatch } from "@store/hooks";
import { setAssets, setSymbol } from "@store/slices/markets";
import { Dispatch, SetStateAction } from "react";
import { LeftSubDrawer } from "../../types";

interface AssetsMenuProps {
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const AssetsMenu: React.FunctionComponent<AssetsMenuProps> = ({setIsDrawerOpen}) => {
  const dispatch = useAppDispatch();
  const [timesData] = useState(times);
  const [forexData] = useState(forex);
  const [stocksData] = useState(stocks);

  const [selectedTab, setSelectedTab] = useState("fixed");
  const [timezone, setTimezone] = useState<string>("");
  const [selectedForex, setSelectedForex] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleButtonClick = (buttonName: string) => {
    setSelectedTab(buttonName);
  };

  return (
    <div className="assetsMenu">
      <ArrowsSlider>
        <div className="slider">
          <button
            className={`fixedTime ${selectedTab === "fixed" ? "active" : ""}`}
            onClick={() => handleButtonClick("fixed")}
          >
            Fixed Time
          </button>
          <button
            className={selectedTab === "forex" ? "active" : ""}
            onClick={() => handleButtonClick("forex")}
          >
            Forex
          </button>
          <button
            className={selectedTab === "stocks" ? "active" : ""}
            onClick={() => handleButtonClick("stocks")}
          >
            Stocks
          </button>
          <button
            className={selectedTab === "commodities" ? "active" : ""}
            onClick={() => handleButtonClick("commodities")}
          >
            Commodities
          </button>
          <button
            className={selectedTab === "crypto" ? "active" : ""}
            onClick={() => handleButtonClick("crypto")}
          >
            Crypto
          </button>
        </div>
      </ArrowsSlider>

      <SearchBar className="assetsSearchbar" />

      <div className="assetsFilters">
        <div className="filterButton">Favorites</div>
        <Select
          className="filterSelectlist"
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
      </div>

      {selectedTab === "fixed" ? (
        <Row className="assetsList" gutter={[2, 2]} justify="start">
          <Col span={12} className="assetsListCol">
            <div className="assetsColIcon barsIcon">
              <FilterBarsIcon />
            </div>
            <p className="assetsListColTitle">Name, Mid Price</p>
          </Col>

          <Col span={12} className="assetsListCol alignEnd">
            <p className="assetsListColTitle">24-hr changes</p>
          </Col>

          {timesData.map((item, index) => (
            <Col span={24} key={`assetListItem ${item.value + "_" + index}`}>
              <div
                className={`assetsListItem ${
                  timezone === item.value ? "active" : ""
                }`}
                onClick={() => {
                  dispatch(setSymbol(item.value));
                  dispatch(setAssets(item.image));
                  setTimezone(item.value);
                  setIsDrawerOpen(false);
                }}
              >
                <div className="contentLeft">
                  <img src={item.image} />
                  <div>
                    <p className="itemTitle">{item.name}</p>
                    {item?.quickTrading ? (
                      <p className="itemSubtext">5 Second Trading</p>
                    ) : null}
                  </div>
                </div>
                <div className="contentRight">
                  <p className={`itemText ${item?.inProfit ? "primary" : ""}`}>
                    {item.profit}%
                  </p>
                  <QuestionMarkIcon />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : selectedTab === "forex" ? (
        <Row className="assetsList" gutter={[2, 2]} justify="start">
          <Col span={12} className="assetsListCol">
            <div className="assetsColIcon barsIcon">
              <FilterBarsIcon />
            </div>
            <p className="assetsListColTitle">Name, Mid Price</p>
          </Col>

          <Col span={12} className="assetsListCol alignEnd">
            <p className="assetsListColTitle">24-hr changes</p>
          </Col>

          {forexData.map((item, index) => (
            <Col span={24} key={`assetListItem ${item.value + "_" + index}`}>
              <div
                className={`assetsListItem ${
                  selectedForex === item.value ? "active" : ""
                }`}
                onClick={() => {
                  dispatch(setSymbol(item.value));
                  dispatch(setAssets(item.image));
                  setSelectedForex(item.value);
                  setIsDrawerOpen(false);
                }}
              >
                <div className="contentLeft">
                  <img src={item.image} />
                  <p className="itemTitle">{item.name}</p>
                </div>
                <div className="contentRight">
                  <p
                    className={`itemText ${
                      item?.inProfit ? "success" : "danger"
                    }`}
                  >
                    {item.profit}%
                  </p>
                  <QuestionMarkIcon />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : selectedTab === "stocks" ? (
        <Row className="assetsList" gutter={[2, 2]} justify="start">
          <Col span={12} className="assetsListCol">
            <div className="assetsColIcon barsIcon">
              <FilterBarsIcon />
            </div>
            <p className="assetsListColTitle">Name</p>
          </Col>

          <Col span={12} className="assetsListCol alignEnd">
            <p className="assetsListColTitle">Ask Price</p>
            <div className="assetsColIcon questionIcon">
              <QuestionMarkIcon />
            </div>
          </Col>

          {stocksData.map((item, index) => {
            const disabled = !!item.value;

            return (
              <Col span={24} key={`assetListItem ${item.value + "_" + index}`}>
                <div
                  className={`assetsListItem ${
                    selectedStock === item.value ? "active" : ""
                  } ${disabled ? "disabled" : ""}`}
                  onClick={() => {
                    dispatch(setSymbol(item.value));
                    dispatch(setAssets(item.image));
                    setSelectedStock(!disabled ? item.value : selectedStock);
                    setIsDrawerOpen(false);
                  }}
                >
                  <div className="contentLeft">
                    <img src={item.image} />
                    <div>
                      <p className="itemTitle">{item.name}</p>
                      {disabled ? (
                        <p className="itemSubtext">Closed until Jan25, 09:35</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="contentRight">
                    <p className="itemText">{item.profit}</p>
                    <InfoCircleIconSmall />
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      ) : null}
    </div>
  );
};

export default AssetsMenu;
