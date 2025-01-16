import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Modal as AntModal, Typography } from "antd";

import LongArrowLeft from "../../../../../../assets/icons/LongArrowLeftIcon";
import Input from "../../../../../../components/input/Input";
import BoldSearchIcon from "../../../../../../assets/icons/BoldSearchIcon";
import FillDownArrow from "../../../../../../assets/icons/FillDownArrow";
import Modal from "../../../../../../components/modal/Modal";
import FillLockIcon from "../../../../../../assets/icons/FillLock";

import { banks, companyDescriptionList } from "./constants";

import { reigionDetector } from "./helpers";
import { CountryCode } from "./types";
import "./ConnectBanks.scss";

interface ConnectBanksModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ConnectBanksModal: React.FC<ConnectBanksModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const [isSubModalShow, setIsSubModalShow] = useState(false);
  const [currentReigion, setCurrentReigion] = useState<CountryCode | undefined>(
    undefined
  );

  useEffect(() => {
    async function reigionHandler() {
      const reigionData = await reigionDetector();
      if (reigionData && Object.keys(banks).includes(reigionData.countryCode))
        return setCurrentReigion(reigionData?.countryCode as CountryCode);
      return setCurrentReigion("default");
    }
    reigionHandler();
  }, []);

  return (
    <>
      <AntModal
        rootClassName="connect-banks-modal-root"
        styles={{
          mask: {
            backdropFilter: "blur(5px)",
          },
        }}
        footer={false}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="connect-banks-content">
          <div className="bank-details">
            <div className="bank-details-container">
              <LongArrowLeft />
              <Typography.Text className="bank-details-title">
                Bank Details
              </Typography.Text>
              <Typography.Text className="bank-details-description">
                You are pre - approved for a loan with Olymp Trade now. It’s
                time to verify your bank account. No documentation or manual
                process required.
              </Typography.Text>
            </div>
          </div>
          <div className="connect-banks-list">
            <Typography.Text className="banks-title">Banks</Typography.Text>
            <div className="find-bank-input-container">
              <Input
                placeholder="Find a bank"
                className="find-bank-input"
                icon={<BoldSearchIcon />}
              />
            </div>
            <div className="banks-cards-list">
              {currentReigion &&
                banks?.[currentReigion].length > 0 &&
                banks[currentReigion].map(({ logo }) => (
                  <div
                    className="banks-card-item"
                    onClick={() => {
                      setIsSubModalShow(true);
                    }}
                  >
                    <img src={logo} />
                  </div>
                ))}

              <Modal open={isSubModalShow} setOpen={setIsSubModalShow}>
                <div className="sub-modal-container">
                  <Typography.Text className="sub-modal-title">
                    № 26{" "}
                  </Typography.Text>
                  <Typography.Text className="sub-modal-sub-title">
                    Authentication with № 26
                  </Typography.Text>
                  <div>
                    {companyDescriptionList.map((text, index) => (
                      <>
                        <Typography.Text
                          className="sub-modal-numbers-list"
                          key={`${index}-${text}`}
                        >
                          <p>
                            {index + 1}. {text}
                          </p>
                        </Typography.Text>
                        <br />
                      </>
                    ))}
                  </div>
                  <div className="should-login-message">
                    <FillLockIcon />
                    Only you will be able to see the login details
                  </div>
                </div>
              </Modal>
            </div>
            <Button className="show-more-banks-btn" type="text">
              <Typography.Text className="show-more-text">
                show more
              </Typography.Text>
              <br />
              <FillDownArrow />
            </Button>
          </div>
        </div>
      </AntModal>
    </>
  );
};

export default ConnectBanksModal;
