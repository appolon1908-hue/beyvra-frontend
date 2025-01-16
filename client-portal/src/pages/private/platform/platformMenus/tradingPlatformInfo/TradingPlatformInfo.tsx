import { Button } from "antd";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import "./TradingPlatformInfo.scss";
import { ArrowRightIcon } from "../../../../../assets/icons";
import { Dispatch, SetStateAction } from "react";
import { LeftSubDrawer } from "../../types";

interface TradingPlatformInfoProps {
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>;
}

const TradingPlatformInfo: React.FunctionComponent<
  TradingPlatformInfoProps
> = ({ setLeftSubDrawer }) => {
  return (
    <div className="trading-platforms-info">
      <Button className="btn" onClick={() => setLeftSubDrawer("help-center")}>
        Back to User Guide
      </Button>
      <MainItemCard className="trading-platforms-info-about">
        <h3>What is a Trading Platform?</h3>
        <p>
          It is an Online Platform where traders track the quotes of different
          kinds of assets and make trades using the services provided by a
          broker.
        </p>
      </MainItemCard>
      <div
        className="olymp-trade"
        onClick={() => setLeftSubDrawer("why-coose-us")}
      >
        <ArrowRightIcon width="" height="" color="#0094FF" />
        <div>Why Should I Choose Tradx?</div>
      </div>
    </div>
  );
};

export default TradingPlatformInfo;
