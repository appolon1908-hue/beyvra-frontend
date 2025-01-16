import { Button } from "antd";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import "./OlympTradeInfo.scss";
import { ArrowRightIcon } from "../../../../../assets/icons";
import { Dispatch, SetStateAction } from "react";
import { LeftSubDrawer } from "../../types";

interface OlympTradeInfoProps {
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>;
}

const OlympTradeInfo: React.FunctionComponent<OlympTradeInfoProps> = ({
  setLeftSubDrawer,
}) => {
  return (
    <div className="olymp-trade-info">
      <Button className="btn" onClick={() => setLeftSubDrawer("help-center")}>
        Back to User Guide
      </Button>
      <MainItemCard className="olymp-trade-info-about">
        <h3>Why Should I Choose Tradx?</h3>
        <p>
          Traders have various reasons for choosing a broker. And here are some
          things that may become most important for you:
          <br />
          <br />
          <span>• Easy start.</span> The minimum trade amount starts at $1/€1
          <br />
          <br />
          <span>• Free education.</span> Use ready-made strategies, watch video
          tutorials and webinars.
          <br />
          <br />
          <span>• Round-the-clock support.</span> Our specialists speak 15
          languages and are ready to help in resolving any issue.
          <br />
          <br />
          <span>• Fast funds withdrawal.</span> Withdraw your funds with zero
          commission in the most convenient way.
          <br />
          <br />
          <span>• Guarantees.</span> Tradx is a certified broker. All
          traders’ deposits are insured.
        </p>
      </MainItemCard>
      <div className="olymp-trade">
        <ArrowRightIcon width="" height="" color="#0094FF" />
        <div>What is a time frame?</div>
      </div>
    </div>
  );
};

export default OlympTradeInfo;
