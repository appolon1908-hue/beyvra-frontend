import { useEffect, useState } from "react";
import { Button, Tooltip } from "antd";
import ChartComponent from "../components/WalkthroughChart";
import { staticData } from "../data/initialGraphData";
import { useTranslation, withTranslation } from "react-i18next";

interface ProfitablityProps {
  className: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  open: boolean;
}

const Profitablity: React.FC<ProfitablityProps> = ({
  className,
  setStep,
  open,
}) => {
  const [graphData, setGraphData] = useState<any>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setGraphData(staticData);
  }, []);

  const TooltipContent = () => (
    <div>
      <p>{t("toolTipContent")}</p>
      <Button onClick={() => setStep(7)}>{t("understand")}</Button>
    </div>
  );
  return (
    <div className={`walkthroughStep profitablityStep ${className}`}>
      <div className="graphContainerWalkthrough">
        {graphData?.length && <ChartComponent data={graphData} />}
        <div className="graphOverlay"></div>
      </div>
      <Tooltip
        rootClassName="walkthroughTooltip"
        placement="bottomRight"
        title={<TooltipContent />}
        color="#1973FA"
        open={open}
      >
        <img
          className="euroUsdButton active"
          src="/walkthrough/eur-usd-btn-active.png"
        />
      </Tooltip>
    </div>
  );
};

export default withTranslation()(Profitablity);
