import { Col, Row } from "antd";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import "./boostCubes.scss";
import { Dispatch, SetStateAction } from "react";
import { RightDrawerContent, RightSubDrawerContent } from "../../types";
import { InfoCircleIconSmall } from "../../../../../assets/icons";

interface BoostCubesProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
  setIsRightDrawerContent: Dispatch<SetStateAction<RightDrawerContent>>;
}

const BoostCubes: React.FunctionComponent<BoostCubesProps> = ({
  setIsRightSubDrawerOpen,
  setIsRightSubDrawerContent,
  setIsRightDrawerContent,
}) => {
  return (
    <div className="boostCubes">
      <div className="infoIcon">
        <InfoCircleIconSmall />
      </div>
      <MainItemCard variant={3} className="boostCubes-Card">
        <Row>
          <Col span={14}>
            <p className="boostCubes-text">
              Invite your Friends to Trade and receive a Boost Cube
            </p>
            <button
              onClick={() => {
                setIsRightSubDrawerContent("referral-program");
              }}
              className="boostCubes-button"
            >
              Open Referral Program
            </button>
          </Col>
          <Col className="img-col" span={6}>
            <img src="/menu-images/svgs/envelope.svg" alt="" />
          </Col>
        </Row>
      </MainItemCard>
      <MainItemCard
        variant={3}
        className="boostCubes-Card"
        onClick={() => {
          setIsRightSubDrawerOpen(false);
          setIsRightDrawerContent("account");
        }}
      >
        <Row>
          <Col span={13}>
            <p className="boostCubes-text">
              Make your first USDT Deposit and receive a Boost Cube
            </p>
            <button className="boostCubes-button">Make Deposit</button>
          </Col>
          <Col className="img" span={11}>
            <img src="/menu-images/svgs/tether.svg" alt="" />
          </Col>
        </Row>
      </MainItemCard>
    </div>
  );
};

export default BoostCubes;
