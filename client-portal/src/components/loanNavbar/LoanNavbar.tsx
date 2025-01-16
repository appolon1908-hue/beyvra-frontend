import { useState } from "react";
import "./loanNavbar.scss";
import {
  EyeIcon,
  NotificationIcon3,
  ProfileIcon2,
  SearchIcon,
} from "../../assets/icons";

const LoanNavbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleNavigationToggle = () => {
    setToggleMenu(!toggleMenu);
  };
  return (
    <nav className={`${toggleMenu ? "nav-top" : ""}`}>
      <div className="loan-logo"></div>
      <div className="loan-links">
        <p>Download</p>
        <p>Movement</p>
        <p>Bills</p>
        <p>Support</p>

        <SearchIcon />
        <EyeIcon />
        <NotificationIcon3 />
        <ProfileIcon2 />
      </div>
      {toggleMenu && (
        <div className="mobile-nav">
          <p>Download</p>
          <p>Movement</p>
          <p>Bills</p>
          <p>Support</p>
          <div className="loan-icons">
            <SearchIcon />
            <EyeIcon />
            <NotificationIcon3 />
            <ProfileIcon2 />
          </div>
        </div>
      )}
      {!toggleMenu ? (
        <div onClick={handleNavigationToggle} className="hamburger-icon">
          <div className="ham-line-1"></div>
          <div className="ham-line-2"></div>
          <div className="ham-line-3"></div>
        </div>
      ) : (
        <div onClick={handleNavigationToggle} className="hamburger-icon-cross">
          <div className="ham-cross-1"></div>
          <div className="ham-cross-2"></div>
        </div>
      )}
    </nav>
  );
};

export default LoanNavbar;
