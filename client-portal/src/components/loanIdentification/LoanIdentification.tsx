import { Col, Row } from "antd";
import "./loanIdentification.scss";
import LoanInput from "../loanInput/LoanInput";
import VerificationInput from "react-verification-input";
import { useState } from "react";
import Modal from "../modal/Modal";

const LoanIdentification = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div className="loanIdentification">
      <Row className="getLoanRow">
        <Col className="PersonalDatainputWrapper" md={20} lg={12} xl={10}>
          <h2>IDENTIFICATION</h2>
          <div className="rectangle-download-links"></div>
          <p className="paragraph">
            Identification of your personality takes place in accordance with
            the data provided by you.
          </p>
        </Col>
        <Col className="col" md={24} lg={24} xl={24}>
          <p>Confirmation code sent to email</p>
          <LoanInput placeholder="E mail" type="email" />
          <div className="VerificationCodeInputContainer">
            <p>confirmation code</p>
            <div className="fourDigitVerificationCode">
              <VerificationInput length={4} placeholder="" />
            </div>
          </div>
          <div className="confirmButton">
            <button onClick={() => setModalOpen(true)}>Confirm</button>
          </div>
          <div>
            <img src="/menu-images/mailImage.png" alt="" />
          </div>
        </Col>
      </Row>
      <Modal
        closeable={false}
        open={isModalOpen}
        setOpen={setModalOpen}
        rootClassName="ModalLoanIdentification"
      >
        <div className="ModalContent">
          <div className="ModalImage">
            <img src="/menu-images/EmailImage.png" alt="Email" />
          </div>
          <h2>Congratulations!</h2>
          <p>
            We have received you personal details and will contact you as soon
            as possible.
          </p>
          <div className="ButtonModal">
            <button onClick={() => setModalOpen(false)}>Go Back</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LoanIdentification;
