import { useEffect, useState } from "react";
import TradeForm from "../../../../../components/tradeForm/TradeForm";
import ChartComponent from "../components/WalkthroughChart";
import { staticData } from "../data/initialGraphData";
import useWindowWidth from "hooks/useWindowWidth";

interface SetDurationProps {
  className: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  open: boolean;
  tradeFormHeight: number;
}

const SetDuration: React.FC<SetDurationProps> = ({
  className,
  setStep,
  open,
  tradeFormHeight,
}) => {
  const [graphData, setGraphData] = useState<any>([]);
  const windowWidth = useWindowWidth();

  const calculateChartHeight = () => {
    return `calc(100% - ${tradeFormHeight}px)`;
  };

  useEffect(() => {
    setGraphData(staticData);
  }, []);

  return (
    <div className={`walkthroughStep setDurationStep ${className}`}>
      <div
        className="setDurationStepLeft"
        style={{ height: calculateChartHeight() }}
      >
        <div className="graphContainerWalkthrough">
          {graphData?.length && <ChartComponent data={graphData} />}
          <div className="graphOverlay"></div>
        </div>
        <img
          className="euroUsdButton active"
          src="/walkthrough/eur-usd-btn-2.png"
        />
      </div>
      <div className="tradingForm">
        <TradeForm
          defaultAmount="100"
          defaultDuration="2 min"
          coinInfo={false}
          showProfit={false}
          showSetupOrder={false}
          durationTooltip={open}
          durationTooltipPlacement={windowWidth >= 768 ? "left" : "topLeft"}
          profitPercent="+85%"
          hintDuration
          disabled
          onDecreaseDuration={() => setStep(9)}
        />
      </div>
    </div>
  );
};

export default SetDuration;
