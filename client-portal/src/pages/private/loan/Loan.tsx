import "./loan.scss";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";

const Loan = () => {
  return (
    <div className="loan">
      {/* <LoanNavbar /> */}
      <div className="loanHeader">
        <div>
          <div className="loanTitle">Get a Loan</div>
          <div className="rectangle-loan-links"></div>
        </div>
        <div className="btnBox">
          Back
        </div>
      </div>
      <Row className="BoxesDiv">
        <Link to="/loan/microlenders">
          <Col className="rectangleBox">
            <div className="Elipse"></div>
            <p>Micro Lenders</p>
          </Col>
        </Link>
        <Link to="/loan/get-loan">
          <Col className="rectangleBox">
            <div className="Elipse2"></div>
            <p>Loan</p>
          </Col>
        </Link>
      </Row>
    </div>
  );
};

export default Loan;
