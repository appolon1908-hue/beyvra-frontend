import { useEffect, useState } from "react";
import TradeForm from "../../../../../components/tradeForm/TradeForm";
import ChartComponent from "../components/WalkthroughChart";
import { staticData } from "../data/initialGraphData";
import useWindowWidth from "hooks/useWindowWidth";

interface SetInvestmentProps {
  className: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  open: boolean;
  tradeFormHeight: number;
}

const SetInvestment: React.FC<SetInvestmentProps> = ({
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
    <div className={`walkthroughStep setInvestmentStep ${className}`}>
      <div
        className="setInvestmentStepLeft"
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
          defaultAmount="90"
          defaultDuration="2 min"
          coinInfo={false}
          showProfit={false}
          showSetupOrder={false}
          amountTooltip={open}
          amountTooltipPlacement={windowWidth >= 768 ? "left" : "topRight"}
          profitPercent="+85%"
          hintPlus
          disabled
          setStep={setStep}
        />
      </div>
    </div>
  );
};

export default SetInvestment;
