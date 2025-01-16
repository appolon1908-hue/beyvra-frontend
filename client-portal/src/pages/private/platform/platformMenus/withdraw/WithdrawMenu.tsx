import { UsdIcon2, InfoCircleIconSmall } from "../../../../../assets/icons";
import DepositCard from "../../../../../components/depositCard/DepositCard";
import WithdrawCard from "../../../../../components/withdrawCard/WithdrawCard";
import { FC, useState } from "react";

import "./withdrawMenu.scss";
import { Col, Modal, Row } from "antd";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import SecondaryButton from "../../../../../components/secondaryButton/SecondaryButton";
import WithdrawWireTransfer from "./WithdrawWireTransfer";
import WithdrawHelpCenter from "../withdrawHelpCenter/WithdrawHelpCenter";

interface WithdrawMenuProps {
  isModalOpen?: boolean;
  setIsModalOpen?: any;
  setIsWithdrawAccountModalOpen?: any;
  setIsModalDepositOpen?: any;
}

const WithdrawMenu: FC<WithdrawMenuProps> = ({
  isModalOpen,
  setIsModalOpen,
  setIsWithdrawAccountModalOpen,
  setIsModalDepositOpen,
}) => {
  const [show, setShow] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  
  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        className="depositModal"
        footer={""}
        centered

        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', paddingRight: '1.4rem', width: '100%' }}>
            <span onClick={showModal}> <InfoCircleIconSmall /> </span>
          </div>
        }
      >
        <div className="WithdrawMenu">
          <div className="withdrawTitle">Withdraw</div>
          <DepositCard
            CountryIcon={<UsdIcon2 />}
            account="From EUR Account"
            amount={0}
            icon
            onClick={() => {
              setIsWithdrawAccountModalOpen(true);
            }}
            currency={""}
          />
          <WithdrawCard
            setIsModalOpen={setIsModalOpen}
            setIsModalDepositOpen={setIsModalDepositOpen}
          />
          <Row gutter={15} className="buttonsRow">
            <Col span={12}>
              <PrimaryButton
                Title="Select Account"
                className="SelectAccountButton"
                onClick={() => null}
              />
            </Col>
            <Col span={12}>
              <SecondaryButton Title="Wire Transfer" onClick={() => setShow(true)} />
            </Col>
          </Row>
        </div>
      </Modal>
      <Modal
        open={show}
        onCancel={() => setShow(false)}
        closable={true}
        footer={null}
        style={{ width: 600 }}
        className="withdrawWireTransferModal"
        centered
      >
        <WithdrawWireTransfer />
      </Modal>

      <Modal
        title={null}
        open={modalVisible} // Updated to the new state variable name
        onCancel={handleCancel}
        footer={null}

        closable={true}
        style={{ width: 6000 }}
        className="withdrawWireTransferModal"
        centered
      >
        <WithdrawHelpCenter />
      </Modal>


    </>
  );
};

export default WithdrawMenu;
