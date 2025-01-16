import { Col, Row } from "antd";
import "./loanPersonalData.scss";
import LoanInput from "../loanInput/LoanInput";
import { AgreeIcon } from "../../assets/icons";

const InputListLeft = [
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

const InputListRight = [
  {
    id: 1,
    placeholder: "Occupation",
    type: "text",
  },
  {
    id: 2,
    placeholder: "Positions",
    type: "text",
  },
  {
    id: 3,
    placeholder: "Company name",
    type: "text",
  },
  {
    id: 4,
    placeholder: "Home Address",
    type: "text",
  },
];

const LoanPersonalData = () => {
  return (
    <div className="LoanPersonalData">
      <Row className="getLoanRow">
        <Col className="PersonalDatainputWrapper" md={20} lg={12} xl={10}>
          <h2>PERSONAL DATA</h2>
          <div className="rectangle-download-links"></div>
          <p className="paragraph">
            The data in this form must match the data in your documents. <br />
            <br />
            Information about your activities and personal data must be based on
            real information about you.
          </p>
          {InputListLeft.map((input) =>
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
                    {" "}
                    there is some dummy text
                  </p>
                )}
              </LoanInput>
            )
          )}
        </Col>
        <Col className="col" md={20} lg={12} xl={10}>
          <div className="loanInformationWrapper">
            <div className="loanTransferWrapper">
              {InputListRight.map((input) => (
                <LoanInput
                  key={input.id}
                  placeholder={input.placeholder}
                  type={input.type}
                >
                  {input.placeholder !== "Home Address" ? (
                    <p style={{ visibility: "hidden" }}>
                      there is some dummy text
                    </p>
                  ) : (
                    <p></p>
                  )}
                </LoanInput>
              ))}
              <div className="lastInputs">
                <LoanInput placeholder="Flat" type="text">
                  <p style={{ visibility: "hidden" }}>
                    there is some dummy text
                  </p>
                </LoanInput>
                <LoanInput placeholder="Postal code" type="number">
                  <p style={{ visibility: "hidden" }}>
                    there is some dummy text
                  </p>
                </LoanInput>
              </div>
            </div>
            <div className="tickIconImage">
              <img src="/menu-images/tickIcon.png" alt="" />
            </div>
          </div>
        </Col>
      </Row>
      <div className="AgrementCheckMark">
        <AgreeIcon />
        <p>
          I agree with all the rules for using this resource and give the right
          to process my personal data.
        </p>
      </div>
      <div className="buttonDiv">
        <button>CREATE MY ACCOUNT</button>
      </div>
    </div>
  );
};

export default LoanPersonalData;
