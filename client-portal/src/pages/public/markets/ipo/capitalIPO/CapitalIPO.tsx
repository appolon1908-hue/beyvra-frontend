import { useTranslation } from "react-i18next";
import "./CapitalIPO.scss";

//img
import MainSvg from "../../../../../assets/markets/ipo/capitalIPO.png";

const CapitalIPO = () => {
  const { t } = useTranslation();
  return (
    <div className="capitalIPOContainer">
      <div>
        <h2>{t("capitalIPO")}</h2>
        <span>{t("subCapitalIPOOne")}</span>
        <span>{t("subCapitalIPOTwo")}</span>
        <span>{t("subCapitalIPOThree")}</span>
      </div>

      <div>
        <img src={MainSvg} alt="" />
      </div>
    </div>
  );
};

export default CapitalIPO;
