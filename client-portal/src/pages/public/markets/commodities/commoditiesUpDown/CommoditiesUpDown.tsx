import { useTranslation } from "react-i18next";
import "./CommoditiesUpDown.scss";

//img
import DdopsImg from "../../../../../assets/markets/commodities/drops-blue.png";
import BigGoldImg from "../../../../../assets/markets/commodities/big-gold.png";
import GreyGoldImg from "../../../../../assets/markets/commodities/gold-grey.png";
import TimeSvg from "../../../../../assets/markets/commodities/time.svg";
import RightUpSvg from "../../../../../assets/markets/commodities/arrowRightUp.svg";
import RightDownSvg from "../../../../../assets/markets/commodities/arrowRightDown.svg";

const data = [
  {
    title: "setupOrder",
    image: TimeSvg,
    background: "#1A1D21",
  },
  {
    title: "up",
    image: RightUpSvg,
    background: "#1FBF75",
  },
  {
    title: "down",
    image: RightDownSvg,
    background: "#F15131",
  },
];

const CommoditiesUpDown = () => {
  const { t } = useTranslation();
  return (
    <div className="commoditiesUpDownContainer">
      <div className="commoditiesUpDownFirst">
        <h2>{t("whyTradeCommodityCFDs")}</h2>
        <span>{t("subWhyTradeCommodityCFDs")}</span>
        <button>{t("startTrading")}</button>
      </div>
      <div className="commoditiesUpDownSecond">
        <img src={DdopsImg} alt="" />
        <div className="commoditiesUpDownImages">
          <img src={BigGoldImg} alt="" />
          <img src={GreyGoldImg} alt="" />
        </div>
        <div className="commoditiesUpDownSetUp">
          {data &&
            data.map((item, index) => (
              <div
                style={{ backgroundColor: item.background }}
                key={index + item.title}
              >
                <span>{t(item.title)}</span>
                <img
                  style={{
                    width: index === 0 ? "24.65px" : "14.78px",
                    height: index === 0 ? "24.65px" : "14.78px",
                  }}
                  src={item.image}
                  alt=""
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommoditiesUpDown;
