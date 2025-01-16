import "./WithdrawHelpCenter.scss";
import React from "react";
import { Modal } from "antd";
import HelpCenterCard from "./helpCenterCard";


const WithdrawHelpCenter: React.FC = () => {
  return (
    <div className="parentDiv">
        <div className="headerDiv">
          Help Center
        </div>

        <div className="bodyDiv">
          <HelpCenterCard />
        </div>
        <div className="bodyDiv">
          <HelpCenterCard />
        </div>
        <div className="bodyDiv">
          <HelpCenterCard />
        </div>
       

        
      </div>
  );
};

export default WithdrawHelpCenter;