import { useTranslation } from "react-i18next";
import "./Header.scss";

const Header = () => {
  const { t } = useTranslation();

  return (
    <div className="headerEtfContainer">
      <h2>{t("whatIsETF")}</h2>
      <span>{t("subWhatIsETF")}</span>
    </div>
  );
};

export default Header;
