import { useEffect, useState } from "react";
import { staticData } from "../data/initialGraphData";
import ChartComponent from "../components/WalkthroughChart";
import { useTranslation } from "react-i18next";

interface ForeCastProps {
  className: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const ForeCast: React.FC<ForeCastProps> = ({ className, setStep }) => {
  const [graphData, setGraphData] = useState<any>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setGraphData(staticData);
  }, []);

  return (
    <div className={`walkthroughStep forecastStep ${className}`}>
      <div className="graphContainerWalkthrough">
        {graphData?.length && <ChartComponent data={graphData} />}
        <div className="graphOverlay"></div>
      </div>
      <img className="euroUsdButton" src="/walkthrough/eur-usd-btn.png" />
      <p className="walkthroughSubtext">{t("walkthroughForeCastSubText")}</p>

      <button className="walkthroughButton" onClick={() => setStep(5)}>
        {t("next")}
      </button>
    </div>
  );
};

export default ForeCast;
