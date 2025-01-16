import "./WithdrawHelpCenter.scss";
import React from "react";
import { Modal } from "antd";


const HelpCenterCard: React.FC = () => {
  return (
    <div className="cardParentDiv">
        <div className="cardHeaderDiv">
          <h2> Reqeust for Withdrawal </h2>
        </div>

        <div className="bodyDiv">
          <ul className="contentList">
            <li className="contentListItem">
              <></>
              <span>
                What Payment Methods Can I Withdraw Funds To?
              </span>
            </li>

            <li className="contentListItem">
              <></>
              <span>
                How can I add to my Payment method?
              </span>
            </li>

          </ul>

        </div>
      
  
    </div>
  );
};

export default HelpCenterCard;