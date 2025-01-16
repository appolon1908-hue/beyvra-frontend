import { Col, Modal, Row } from "antd";
import "./SelectAmountMenu.scss";
import AmountCard from "../../../../../components/amountCard/AmountCard";
import { FC } from "react";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import { useAppSelector } from "@store/hooks";

interface SelectAmountMenuProps {
  isModalOpen: any
  setIsModalOpen: any
}

const SelectAmountMenu: FC<SelectAmountMenuProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const { selectedWallet } = useAppSelector((state) => state.wallet);
  const { amount } = useAppSelector((state) => state.payment);
  const currency = selectedWallet?.currency?.symbol || "";

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      className="depositModal"
      footer={''}
      centered
    >
      <div className="selectAmountMenuCon">
        <div className="selectAmountMenuCon-title">
          Select Deposit Amount
        </div>
        <div className="selectedAmountdiv">
          <div>
            <div className="cardSubtext">{`Amount, ` + currency}</div>
            <div className="cardTitle">
              {currency} {amount ?? 0}
            </div>
          </div>
        </div>
        <Row gutter={[25, 10]}>
          <Col lg={12} md={24} sm={24}>
            <AmountCard amount={10000} currency={currency} setIsModalOpen={setIsModalOpen} />
          </Col>
          <Col lg={12} md={24} sm={24}>
            <AmountCard amount={5000} currency={currency} setIsModalOpen={setIsModalOpen} />
          </Col>
        </Row>
        <Row style={{ marginTop: "1.25rem" }} gutter={[25, 10]}>
          <Col lg={12} md={24} sm={24}>
            <AmountCard amount={2500} currency={currency} setIsModalOpen={setIsModalOpen} />
          </Col>
          <Col lg={12} md={24} sm={24}>
            <AmountCard amount={2000} currency={currency} setIsModalOpen={setIsModalOpen} />
          </Col>
        </Row>
        <Row style={{ marginTop: "1.25rem" }} gutter={[25, 10]}>
          <Col lg={12} md={24} sm={24}>
            <AmountCard amount={1500} currency={currency} setIsModalOpen={setIsModalOpen} />
          </Col>
          <Col lg={12} md={24} sm={24}>
            <AmountCard amount={1000} currency={currency} setIsModalOpen={setIsModalOpen} />
          </Col>
        </Row>
        <Row
          style={{ marginTop: "1.25rem" }}
          gutter={[25, 10]}
        >
          <Col lg={12} md={24} sm={24}>
            <AmountCard amount={500} currency={currency} setIsModalOpen={setIsModalOpen} />
          </Col>
          <Col lg={12} md={24} sm={24}>
            <AmountCard amount={250} currency={currency} setIsModalOpen={setIsModalOpen} />
          </Col>
        </Row>
        <PrimaryButton
          Title="Confirm"
          className="confirmButton"
          onClick={() => { setIsModalOpen(false) }}
        />
      </div>
    </Modal>
  );
};

export default SelectAmountMenu;
