import { Col, Row } from "antd";
import {
  ArrowDownOS,
  BigXMarkIcon,
  GreenSignalsIcon,
  OpenLockIcon,
  PlusIcon2,
  SignalsIcon,
  StatusExpertIcon,
  YellowSignlasIcon,
} from "../../../assets/icons";
import PrimaryButton from "../../../components/primaryButton/PrimaryButton";
import SecondaryButton from "../../../components/secondaryButton/SecondaryButton";
import "./statusDetails.scss";
import Input from "../../../components/input/Input";
import { useState } from "react";

const FaqsList = [
  {
    id: 1,
    question: "What are statuses?",
    answer:
      "Each of the three statuses provides a set of platform tools and features accessible to traders who make deposits of a certain amount or earn it by gaining experience points.",
  },
  {
    id: 2,
    question: "What is the hierarchy of statuses?",
    answer:
      "Each of the three statuses provides a set of platform tools and features accessible to traders who make deposits of a certain amount or earn it by gaining experience points.",
  },
  {
    id: 3,
    question: "What do statuses give?",
    answer:
      "Each of the three statuses provides a set of platform tools and features accessible to traders who make deposits of a certain amount or earn it by gaining experience points.",
  },
  {
    id: 4,
    question: "How long does a status last?",
    answer:
      "Each of the three statuses provides a set of platform tools and features accessible to traders who make deposits of a certain amount or earn it by gaining experience points.",
  },
  {
    id: 5,
    question:
      "After making a deposit or gaining enough XP, how soon is the status upgraded?",
    answer:
      "Each of the three statuses provides a set of platform tools and features accessible to traders who make deposits of a certain amount or earn it by gaining experience points.",
  },
  {
    id: 6,
    question: "How do I renew my status?",
    answer:
      "Each of the three statuses provides a set of platform tools and features accessible to traders who make deposits of a certain amount or earn it by gaining experience points.",
  },
  {
    id: 7,
    question: "How do I get a higher status?",
    answer:
      "Each of the three statuses provides a set of platform tools and features accessible to traders who make deposits of a certain amount or earn it by gaining experience points.",
  },
  {
    id: 8,
    question: "What are experience points?",
    answer:
      "Each of the three statuses provides a set of platform tools and features accessible to traders who make deposits of a certain amount or earn it by gaining experience points.",
  },
];

const StatusDetails = () => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState<number | null>(FaqsList[0]?.id);

  const handleChange = (event: any) => {
    // Removing the $ sign from the start before setting the value
    setValue(event.target.value.replace(/^\$/, ""));
  };
  return (
    <div className="statusDetails">
      <div className="navbar">
        <BigXMarkIcon />
        <div className="buttonContainer">
          <SecondaryButton onClick={() => null} Title="Go Back" />
        </div>
      </div>
      <div className="statusText">
        <div className="mdScreenIcon">
          <BigXMarkIcon />
        </div>
        <h2>Statuses</h2>
        <p>
          Each status has its own path along the Trader’s Way, each with their
          own set of unique rewards. Get higher statuses by making deposits
          or working your way up the Trader’s Way.
        </p>
      </div>
      <div className="CurrentStatus">
        <div className="statusBoxBeginner">
          <div className="beginnerHeader">
            <SignalsIcon />
            <h2>Beginner</h2>
          </div>
          <div className="StatusTitle">Your current status</div>
          <p>Default status with a basic set of accessible features</p>
        </div>
        <div className="statusBoxAdvanced">
          <div className="beginnerHeader">
            <GreenSignalsIcon />
            <h2>Advance</h2>
          </div>
          <div className="StatusTitle">Pending to Unlock</div>
          <p>
            Access to exclusive platform features for traders who want to apply
            more diverse strategies
          </p>
          <PrimaryButton
            className="advancedButton"
            onClick={() => null}
            icon={<OpenLockIcon />}
            Title="Deposit EUR €3000"
          />
        </div>
        <div className="statusBoxSeasoned">
          <div className="beginnerHeader">
            <YellowSignlasIcon />
            <h2>Seasoned</h2>
          </div>
          <div className="StatusTitle">Pending to Unlock</div>
          <p>
            The widest range of tools and features available, perfect for all
            kinds of complex and personalized trading styles
          </p>
          <PrimaryButton
            className="advancedButton"
            onClick={() => null}
            icon={<OpenLockIcon />}
            Title="Deposit EUR €3000"
          />
        </div>
      </div>
      <div className="tableStatus">
        <Row className="headings">
          <Col span={5}></Col>
          <Col span={6} className="tableHeading">
            <div>
              <SignalsIcon />
            </div>
            <h2>Starter</h2>
          </Col>
          <Col span={6} className="tableHeading">
            <div>
              <GreenSignalsIcon />
            </div>
            <h2>Advanced</h2>
          </Col>
          <Col span={6} className="tableHeading">
            <div>
              <StatusExpertIcon />
            </div>
            <h2>Expert</h2>
          </Col>
        </Row>
        <Row className="TableRow1">
          <Col span={5} className="titleBox">
            <h1>Rate of return</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Up to 85%</h2>
              <div className="FTT">FTT</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Up to 89%</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="subHeading">
              2 assets with increased rate of return
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Up to 93%</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="subHeading">
              6 assets with increased rate of return
            </div>
          </Col>
        </Row>
        <Row className="TableRow2">
          <Col span={5} className="titleBox">
            <h1>Commission Discount</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <p className="No">No</p>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Up to 10%</h2>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Up to 20%</h2>
              <div className="FX">FX</div>
            </div>
          </Col>
        </Row>
        <Row className="TableRow3">
          <Col span={5} className="titleBox">
            <h1>Funds Withdrawal</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Normal Priority</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">Receive within 24 hours</div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>High Priority</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">Receive your money faster</div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Top Priority</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">Receive your money in a few hours</div>
          </Col>
        </Row>
        <Row className="TableRow2">
          <Col span={5} className="titleBox">
            <h1>Maximum trade amount</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>$3,000</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="tablefirstcolumn2">
              <p>$2,000</p>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>$4,000</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="tablefirstcolumn2">
              <p>$3,000</p>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>$5,000</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="tablefirstcolumn2">
              <p>$4,000</p>
              <div className="FX">FX</div>
            </div>
          </Col>
        </Row>
        <Row className="TableRow3">
          <Col span={5} className="titleBox">
            <h1>Maximum number of open positions</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>20</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="tablefirstcolumn2">
              <p>100</p>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>50</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="tablefirstcolumn2">
              <p>100</p>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>100</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="tablefirstcolumn2">
              <p>100</p>
              <div className="FX">FX</div>
            </div>
          </Col>
        </Row>
        <Row className="TableRow2">
          <Col span={5} className="titleBox">
            <h1>Trailing Stop Loss</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <p className="No">No</p>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FX">FX</div>
            </div>
          </Col>
        </Row>
        <Row className="TableRow3">
          <Col span={5} className="titleBox">
            <h1>Trading Signals</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">Minor Scalping</div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">Minor Scalping, Minor Intraday</div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">
              Minor Scalping, Minor Intraday, Minor Swing
            </div>
          </Col>
        </Row>
        <Row className="TableRow2">
          <Col span={5} className="titleBox">
            <h1>Advisers</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <p className="No">No</p>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>1</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>3</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
          </Col>
        </Row>
        <Row className="TableRow3">
          <Col span={5} className="titleBox">
            <h1>Education</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">Basic</div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">Basic</div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">Basic and Private</div>
          </Col>
        </Row>
        <Row className="TableRow2">
          <Col span={5} className="titleBox">
            <h1>Personal Analyst</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <p className="No">No</p>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">1 Consultation per month</div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">4 Consultations per month</div>
          </Col>
        </Row>
        <Row className="TableRow3">
          <Col span={5} className="titleBox">
            <h1>Unique Strategies</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>5</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="tablefirstcolumn2">
              <p>3</p>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>12</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="tablefirstcolumn2">
              <p>8</p>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>20</h2>
              <div className="FTT">FTT</div>
            </div>
            <div className="tablefirstcolumn2">
              <p>15</p>
              <div className="FX">FX</div>
            </div>
          </Col>
        </Row>
        <Row className="TableRow2">
          <Col span={5} className="titleBox">
            <h1>Indicators</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>10</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>11</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>14</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
          </Col>
        </Row>
        <Row className="TableRow3">
          <Col span={5} className="titleBox">
            <h1>Exclusive Trading Ideas</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <p className="No">No</p>
          </Col>
          <Col span={6} className="tableTitle">
            <p className="No">No</p>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
          </Col>
        </Row>
        <Row className="TableRow2">
          <Col span={5} className="titleBox">
            <h1>Specialized Webinars</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <p className="No">No</p>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">1 Webinar per Week</div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>Yes</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
            <div className="subHeading">3 Webinars per Week</div>
          </Col>
        </Row>
        <Row className="TableRow3">
          <Col span={5} className="titleBox">
            <h1>Sound Package</h1>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>1</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>2</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
          </Col>
          <Col span={6} className="tableTitle">
            <div className="tablefirstcolumn1">
              <h2>3</h2>
              <div className="FTT">FTT</div>
              <div className="FX">FX</div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="MobileTableStatus">
        <div className="BegginerStatuses">
          <h2>Rate of return</h2>
          <div className="subStatus">
            <h3>Up to 85%</h3>
            <div className="FTT">FTT</div>
          </div>
        </div>
        <div className="BegginerStatuses">
          <h2>Commission Discount</h2>
          <div className="No">No</div>
        </div>
        <div className="BegginerStatuses">
          <h2>Funds Withdrawal</h2>
          <div className="subStatus">
            <h3>Normal Priority</h3>
            <div className="FTT">FTT</div>
            <div className="FX">FX</div>
          </div>
          <p>Receive within 24 hours</p>
        </div>
        <div className="BegginerStatuses">
          <h2>Maximum trade amount</h2>
          <div className="subStatus">
            <h3>$3,000</h3>
            <div className="FTT">FTT</div>
          </div>
          <div className="subStatus">
            <h3>$2,000</h3>
            <div className="FX">FX</div>
          </div>
        </div>
        <div className="BegginerStatuses">
          <h2>Maximum number of open positions</h2>
          <div className="subStatus">
            <h3>20</h3>
            <div className="FTT">FTT</div>
          </div>
          <div className="subStatus">
            <h3>100</h3>
            <div className="FX">FX</div>
          </div>
        </div>
      </div>
      <div className="ArrowDown">
        <ArrowDownOS />
      </div>
      <div className="inputbtnContainer">
        <Input
          title="Deposit amount"
          value={value ? `$${value}` : ""}
          placeholder={value ? "" : "$ 0"}
          onChange={handleChange}
        />
        <PrimaryButton
          className="statusDepositButton"
          onClick={() => null}
          Title="Make a deposit"
        />
      </div>
      <div className="FAQsContainer">
        <div className="FAQsHeader">
          <h2>FAQ</h2>
          <p>
            If you couldn't find an answer to your question, our 24/7 support
            team will be happy to help you.
          </p>
          <PrimaryButton
            className="contactButton"
            Title="Contact Support"
            onClick={() => null}
          />
        </div>
        <div className="FAQsSection">
          {FaqsList.map((faq) => (
            <div
              key={faq.id}
              className="FAQs"
              onClick={() => setOpen(open === faq.id ? null : faq.id)}
            >
              <div className="FAQsQuestions">
                <h2>{faq.question}</h2>
                <div onClick={() => setOpen(open === faq.id ? null : faq.id)}>
                  <PlusIcon2 />
                </div>
              </div>
              {open === faq.id && <h3>{faq.answer}</h3>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusDetails;
