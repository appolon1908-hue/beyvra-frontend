import { useState } from "react";
import LoanRegister from "../../../components/loanRegister/LoanRegister";
import LoanPersonalData from "../../../components/loanPersonalData/LoanPersonalData";
import LoanIdentification from "../../../components/loanIdentification/LoanIdentification";
import "./getLoan.scss";

const GetLoan = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { value: 0, title: "REGISTER" },
    { value: 1, title: "PERSONAL DATA" },
    { value: 2, title: "IDENTIFICATION" },
  ];
  return (
    <div>
      <div className="loanTabsContainer">
        <ul className="breadcrumb">
          {tabs?.map((tab) => (
            <li onClick={() => setActiveTab(tab.value)}>
              <a className={`${tab.value === activeTab ? "active" : ""}`}>
                {tab.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {activeTab === 0 && <LoanRegister />}
      {activeTab === 1 && <LoanPersonalData />}
      {activeTab === 2 && <LoanIdentification />}
    </div>
  );
};

export default GetLoan;
