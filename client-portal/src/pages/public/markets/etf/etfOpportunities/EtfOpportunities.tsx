import { useTranslation } from "react-i18next";
import "./EtfOpportunities.scss";

//img
import MainSvg from "../../../../../assets/markets/etf/etfOpportunities.png";

const EtfOpportunities = () => {
  const { t } = useTranslation();
  return (
    <div className="etfOpportunitiesContainer">
      <div>
        <img src={MainSvg} alt="" />
      </div>

      <div>
        <h2>{t("eTFsOpportunities")}</h2>
        <span>{t("subETFsOpportunities")}</span>
        <span>{t("forInstance")}</span>
        <span>{t("subTwoETFsOpportunities")}</span>
      </div>
    </div>
  );
};

export default EtfOpportunities;
