import { useEffect, useState } from "react";
import { staticData } from "../data/initialGraphData";
import ChartComponent from "../components/WalkthroughChart";
import { useTranslation, withTranslation } from "react-i18next";

interface FixedDurationProps {
  className: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const FixedDuration: React.FC<FixedDurationProps> = ({
  className,
  setStep,
}) => {
  const [graphData, setGraphData] = useState<any>([]);

  const { t } = useTranslation();

  useEffect(() => {
    setGraphData(staticData);
  }, []);

  return (
    <div className={`walkthroughStep fixedDurationStep ${className}`}>
      <div className="graphContainerWalkthrough">
        {graphData?.length && <ChartComponent data={graphData} />}
        <div className="graphOverlay"></div>
      </div>
      <img className="euroUsdButton" src="/walkthrough/eur-usd-btn.png" />
      <p className="walkthroughSubtext">
        {t("walkthroughFixedDurationSubText")}
      </p>

      <button className="walkthroughButton" onClick={() => setStep(6)}>
        {t("next")}
      </button>
    </div>
  );
};

export default withTranslation()(FixedDuration);
