import { useEffect, useState } from "react";
import ChartComponent from "../components/WalkthroughChart";
import { staticData } from "../data/initialGraphData";
import { useTranslation, withTranslation } from "react-i18next";

interface TheChartsProps {
  className: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const TheCharts: React.FC<TheChartsProps> = ({ className, setStep }) => {
  const [graphData, setGraphData] = useState<any>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setGraphData(staticData);
  }, []);

  return (
    <div className={`walkthroughStep theChartsStep ${className}`}>
      <div className="graphContainerWalkthrough">
        {graphData?.length && <ChartComponent data={graphData} />}
        <div className="graphOverlay"></div>
      </div>
      <img className="euroUsdButton" src="/walkthrough/eur-usd-btn.png" />
      <p className="walkthroughSubtext">{t("walkthroughChartsSubText")}</p>

      <button className="walkthroughButton" onClick={() => setStep(4)}>
        {t("next")}
      </button>
    </div>
  );
};

export default withTranslation()(TheCharts);
