import { Col, Row } from "antd";
import "./loanRegister.scss";
import LoanInput from "../loanInput/LoanInput";
import { AgreeIcon, PenIcon } from "../../assets/icons";

const InputList = [
  {
    id: 1,
    placeholder: "Full Name",
    type: "text",
    error: "You must write it exactly as in your ID",
  },
  {
    id: 2,
    placeholder: "Surname",
    type: "text",
    error: "You must write it exactly as in your ID",
  },
  {
    id: 3,
    placeholder: "Second Surname",
    type: "text",
    error: "You must write it exactly as in your ID",
  },
  {
    id: 4,
    placeholder: "Your ID number",
    type: "number",
  },
  {
    id: 5,
    placeholder: "Date of Birth",
    type: "text",
  },
  {
    id: 6,
    placeholder: "Your mobile number",
    type: "number",
  },
  {
    id: 7,
    placeholder: "E mail",
    type: "email",
  },
  {
    id: 8,
    password: true,
  },
];

const LoanRegister = () => {
  return (
    <div className="getLoan">
      <Row className="getLoanRow">
        <Col className="inputWrapper" md={20} lg={12} xl={12}>
          <h2>Sign up to get your credit fast in one click</h2>
          <div className="rectangle-download-links"></div>
          <p className="paragraph">
            Remember that to apply for your credit you need tbe over 21 years
            old. <br />
            <br />
            If you have already applied for a loan with us, access your customer
            area, where you can enjoy exclusive offers and discounts.
          </p>
          {InputList.map((input) =>
            input.password ? (
              <LoanInput key={input.id} password>
                <p style={{ visibility: "hidden" }}>there is some dummy text</p>
              </LoanInput>
            ) : (
              <LoanInput
                key={input.id}
                placeholder={input.placeholder}
                type={input.type}
              >
                {input.error && <p>{input.error}</p>}
                {!input.error && (
                  <p style={{ visibility: "hidden" }}>
                    there is some dummy text{" "}
                  </p>
                )}
              </LoanInput>
            )
          )}
          <div className="AgrementCheckMark">
            <AgreeIcon />
            <p>
              I agree with all the rules for using this resource and give the
              right to process my personal data.
            </p>
          </div>
          <div className="buttonDiv">
            <button>CREATE MY ACCOUNT</button>
          </div>
        </Col>
        <Col className="col" md={20} lg={12} xl={12}>
          <div className="loanTransferWrapper">
            <div className="loanTransferInfo">
              <h1>We transfer your money in just 15 minutes</h1>
              <div className="personalizedLoan">
                <div>
                  <div className="rectangle-links"></div>
                  <p>Your personalized loan</p>
                </div>
                <PenIcon />
              </div>
              <div className="content">
                <div className="contentList">
                  <div className="contentListItem">
                    <p>Amount requested</p>
                    <p>300$</p>
                  </div>
                  <div className="rectangle-line"></div>
                </div>
                <div className="contentList">
                  <div className="contentListItem">
                    <p>Interests</p>
                    <p>39$</p>
                  </div>
                  <div className="rectangle-line"></div>
                </div>
                <div className="contentList">
                  <div className="contentListItem">
                    <p>Term</p>
                    <p>31 days</p>
                  </div>
                  <div className="rectangle-line"></div>
                </div>
                <div className="contentList">
                  <div className="contentListItem">
                    <p>Total to be returned</p>
                    <p>300$</p>
                  </div>
                  <div className="rectangle-line"></div>
                </div>
                <div className="contentList">
                  <div className="contentListItem">
                    <p>Return date</p>
                    <p>28/09/2022</p>
                  </div>
                  <div className="rectangle-line"></div>
                </div>
                <p className="footerText">APR: 107.8%</p>
                <div className="ElipseBlue"></div>
                <div className="ElipseWhite"></div>
              </div>
            </div>
          </div>
          <div>
            <img src="/menu-images/Locker.png" alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoanRegister;
