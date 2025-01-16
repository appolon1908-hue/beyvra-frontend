import "./loanMicroLenders.scss";
import { Col, Row } from "antd";
import LoanNavbar from "../../../components/loanNavbar/LoanNavbar";

const LoanMicroLenders = () => {
  return (
    <div className="loanMicroLenders">
      <LoanNavbar />
      <div className="loanTitle">
        Apply online and get a loan with Micro Lenders
      </div>
      <div className="rectangle-loan-links"></div>
      <div className="loanSubTitle">
        Only trusted companies with excellent reviews.
      </div>
      <Row className="BoxesDiv upperBoxes">
        <Col className="rectangleBox">
          <div className="Elipse"></div>
          <img src="/menu-images/svgs/MoneyMan.svg" alt="MoneyMan" />
        </Col>
        <Col className="rectangleBox">
          <div className="Elipse2"></div>
          <img src="/menu-images/svgs/fintonic.svg" alt="MoneyMan" />
        </Col>
      </Row>
      <Row className="BoxesDiv downsideBoxes">
        <Col className="rectangleBox">
          <div className="Elipse3"></div>
          <img src="/menu-images/svgs/vivus.svg" alt="MoneyMan" />
        </Col>
        <Col className="rectangleBox">
          <div className="Elipse4"></div>
          <img src="/menu-images/svgs/myKredit.svg" alt="MoneyMan" />
        </Col>
      </Row>
    </div>
  );
};

export default LoanMicroLenders;
