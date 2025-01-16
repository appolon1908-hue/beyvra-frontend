import { useState } from "react";
import { DollarSign, Wifi } from "../../../../../assets/icons";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import SecondaryButton from "../../../../../components/secondaryButton/SecondaryButton";
import "./aiAssetSummaryMenu.scss";
import { useAppSelector } from "@store/hooks";

const AiAssetSummaryMenu = () => {
  const [activeButton, setActiveButton] = useState("Recent");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const FinancialsItemsList = [
    {
      title: "Market Cap",
      value: "$24,250,866,863",
    },
    {
      title: "Volume Market Cap",
      value: "$990,871,797",
    },
    {
      title: "Circulating Supply",
      value: "35,479,791,713",
    },
    {
      title: "Total Supply",
      value: "36,671,429,496",
    },
    {
      title: "Max. Supply",
      value: "45,000,000,000",
    },
    {
      title: "Fully Diluted Market Cap",
      value: "$30,992,525,855",
    },
  ];

  const RecentUpdatesList = [
    {
      li: "Development Activity: The Cardano team is actively developing the platform, with hundreds of code commits reported across various components.",
      btn: " www.cardano.com",
    },
    {
      li: "Vasil Hard Fork Impact: The impact of the Vasil hard fork on ADA price is still being evaluated, with some hoping for a rebound.",
      btn: " www.capital.com",
    },
    {
      li: "Cardano Summit 2023: The first-ever Cardano Summit Hackathon with a focus on transparency in governance is coming up in April.",
      btn: " www.finance.com",
    },
  ];
  const {themeSelect} = useAppSelector(state => state.themeBg)

  return (
    <div className={`${themeSelect} aiAssetSummaryMenu`}>
      <div className="assetHeader">
        <SecondaryButton
          className="favouriteBtn"
          Title="Add to Favorites"
          onClick={() => null}
        />
        <PrimaryButton
          className="tradeBtn"
          Title="Trade"
          onClick={() => null}
        />
      </div>
      <div className="assetBody">
        <h2>Asset Summary</h2>
        <p>
          Cardano is a public blockchain platform aiming to be secure, scalable,
          and sustainable. Unlike many other blockchains, Cardano is built on a
          foundation of peer-reviewed research and a commitment to
          evidence-based development.
        </p>
        <div className="priceContainer">
          <div className="currentPrice">
            <DollarSign /> <h2>Current Price</h2> <p>$0.68</p>
          </div>
          <div className="currentPrice">
            <Wifi /> <h2>Avg Historical Price</h2> <p>$0.30</p>
          </div>
        </div>
      </div>
      <div className="btnsClickAble">
        <button
          className={activeButton === "Recent" ? "active" : ""}
          onClick={() => handleButtonClick("Recent")}
        >
          Recent Updates
        </button>
        <button
          className={activeButton === "Financials" ? "active" : ""}
          onClick={() => handleButtonClick("Financials")}
        >
          Financials
        </button>
        <button
          className={activeButton === "SWOT" ? "active" : ""}
          onClick={() => handleButtonClick("SWOT")}
        >
          SWOT
        </button>
      </div>
      <h1>{activeButton === "SWOT" ? "Strenghts" : "Recent Updates"}</h1>
      {activeButton === "Financials" && (
        <div className="financialsContainer">
          {FinancialsItemsList.map((item, index) => (
            <div className="financialItem" key={index}>
              <h3>{item.title}</h3>
              <h4>{item.value}</h4>
            </div>
          ))}
        </div>
      )}
      {activeButton === "Recent" &&
        RecentUpdatesList.map((item, index) => (
          <div className="recentUpdatesContainer" key={index}>
            <li>{item.li}</li>
            <div className="btnContainer">
              <button>{item.btn}</button>
            </div>
          </div>
        ))}
      {activeButton === "SWOT" && (
        <div className="swotContainer">
          <li>
            <span>Scalability:</span> Cardano's Ouroboros proof-of-stake
            consensus mechanism is designed to be highly scalable, able to
            handle a large number of transactions per second.
          </li>
          <li>
            <span>Security:</span> Cardano is built on a strong scientific
            foundation and has undergone rigorous peer review. It is considered
            to be one of the most secure blockchains in existence.
          </li>
          <li>
            <span>Focus on Regulation:</span> The Cardano team is committed to
            working with regulators to ensure that the platform is compliant
            with existing laws. This could make it more attractive to
            institutional investors.
          </li>
        </div>
      )}
    </div>
  );
};

export default AiAssetSummaryMenu;
